import React, { useState, useContext } from 'react';
import './roundThreeStyles.css';
import { roundThreeQuestions } from '../../data/questions/roundThreeQuestions';
import { roundThreeVideoLink } from '../../data/links/roundThreeLinks';
import { db } from '../../src/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '../Loader/Loader';
import { UserContext } from '../../src/UserContext';
import RulesPopup from '../popup/RulesPopup';

const RoundThree = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const videoLink = roundThreeVideoLink;
  const [isOpen,setIsOpen]=useState(false)

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    setIsLoading(true);

    const completeAnswers = roundThreeQuestions.reduce((acc, question) => {
      acc[question.id] = selectedAnswers[question.id] || null;
      return acc;
    }, {});

    let score = 0;

    for (const [questionId, selectedOption] of Object.entries(completeAnswers)) {
      try {
        const questionDoc = doc(db, 'Q&A', questionId);
        const questionData = await getDoc(questionDoc);

        if (questionData.exists()) {
          const correctAnswerId = questionData.data().correctOptionId;
          if (selectedOption === correctAnswerId) {
            score += 5;
          }
        }
      } catch (error) {
        console.error(`Error fetching question ${questionId}:`, error);
      }
    }
// Bonus Points
if(score>15)
{
  score+=5
}

    try {
      const userDoc = doc(db, 'users', user.uid);

      await updateDoc(userDoc, {
        'roundScore.2': score,
      });

      const userData = (await getDoc(userDoc)).data();
      const totalScore = (userData?.totalScore || 0) + score;
      await updateDoc(userDoc, {
        totalScore,
      });

      await updateDoc(userDoc, {
        'submitedAnswer.2': completeAnswers,
      });

      await updateDoc(userDoc, {
        'roundSubmitTime.2': serverTimestamp(),
      });

      await updateDoc(userDoc, {
        activeRound: 3,
      });

      setUser({
        ...user,
        roundScore: {
          ...user.roundScore,
          2: score,
        },
        totalScore,
        submitedAnswer: {
          ...user.submitedAnswer,
          2: completeAnswers,
        },
        roundSubmitTime: {
          ...user.roundSubmitTime,
          2:{
            seconds: Math.floor(Date.now() / 1000),
          },
        },
        activeRound:3,
      });

      // console.log('Data uploaded successfully:', {
      //   score,
      //   completeAnswers,
      //   totalScore,
      // });
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
 

  return (
    <>
    <RulesPopup openPopUp={isOpen} key={!isOpen} content={<>
        <h2>Round 2: Video Round</h2>
      <p><strong>Format:</strong> This round consists of 5 questions based on short video clips. You must answer the questions according to the content of the video.</p>
      
      <h3>Scoring:</h3>
      <p>1. You will earn 5 points for each correct answer.</p>
      <p>2. If your answer is incorrect or left unanswered, you will receive 0 points.</p>

      <h3>Bonus Points:</h3>
      <p>1. If you answer more than 3 questions correctly, you will receive an additional 5 bonus points.</p>

      <p><strong>Maximum possible score for this round:</strong> 30 points (25 for all correct answers + 5 bonus points).</p>
      
      </>}/>
    <div className="q-container">
    <div className="container">
      <h1 className="header">ROUND 2: Video Comprehension</h1>
      <div className='rulesButton' onClick={()=>setIsOpen((s)=>!s)}>Rules</div>
      
      <div className="questionContainer">
        <div className="videoPlayer">
          <iframe
            className="videoPlayer"
            width="560"
            height="315"
            src={videoLink}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        <h2 className="questionText">
          {roundThreeQuestions[currentQuestionIndex].question}
        </h2>
        <div className="optionsContainer">
          {roundThreeQuestions[currentQuestionIndex].options.map((option) => (
            <button
              key={option.id}
              className={`optionButton ${
                selectedAnswers[roundThreeQuestions[currentQuestionIndex].id] ===
                option.id
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleOptionSelect(
                  roundThreeQuestions[currentQuestionIndex].id,
                  option.id
                )
              }
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
      <div className="navigationContainer">
        <button
          className="navButton"
          onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
          }
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        {currentQuestionIndex < roundThreeQuestions.length - 1 ? (
          <button
            className="navButton"
            onClick={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(prev + 1, roundThreeQuestions.length - 1)
              )
            }
          >
            Next
          </button>
        ) : (
          <button className="submitButton" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
    </div>
    </>
  );
};

export default RoundThree;
