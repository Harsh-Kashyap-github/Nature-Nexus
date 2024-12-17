import React, { useState, useContext } from 'react';
import './RoundTwo.css';
import { RoundTwoQuestions } from '../../data/questions/roundTwoQuestions';
import { db } from '../../src/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '../Loader/Loader'; // Import Loader component
import { UserContext } from '../../src/UserContext';
import RulesPopup from '../popup/RulesPopup';

const questions = RoundTwoQuestions;

const RoundTwo = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State to manage loader visibility
  const { user, setUser } = useContext(UserContext); // Get user info from context
  const [isOpen,setIsOpen]=useState(false)

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    setIsLoading(true); // Show loader

    const completeAnswers = questions.reduce((acc, question) => {
      acc[question.id] = selectedAnswers[question.id] || null;
      return acc;
    }, {});

    let score = 0; // Initialize score

    for (const [questionId, selectedOption] of Object.entries(completeAnswers)) {
      try {
        const questionDoc = doc(db, 'Q&A', questionId);
        const questionData = await getDoc(questionDoc);

        if (questionData.exists()) {
          const correctAnswerId = questionData.data().correctOptionId;
          if (selectedOption === correctAnswerId) {
            score += 5; // Add 5 points for correct answer
          }
        }
      } catch (error) {
        console.error(`Error fetching question ${questionId}:`, error);
      }
    }

    //Bonus Points
    if(score>40){
      score+=10
    }
    else if (score>25)
    {
      score+=5
    }

    try {
      const userDoc = doc(db, 'users', user.uid);

      // Upload the round score
      await updateDoc(userDoc, {
        'roundScore.1': score,
      });

      // Update total score
      const userData = (await getDoc(userDoc)).data();
      const totalScore = (userData?.totalScore || 0) + score;
      await updateDoc(userDoc, {
        totalScore,
      });

      // Upload the answers
      await updateDoc(userDoc, {
        'submitedAnswer.1': completeAnswers,
      });

      // Upload the submission time
      await updateDoc(userDoc, {
        'roundSubmitTime.1': serverTimestamp(),
      });

      // Change the active round
      await updateDoc(userDoc, {
        activeRound: 2,
      });

      // Update the user context
      setUser({
        ...user,
        roundScore: {
          ...user.roundScore,
          1: score,
        },
        totalScore,
        submitedAnswer: {
          ...user.submitedAnswer,
          1: completeAnswers,
        },
        roundSubmitTime: {
          ...user.roundSubmitTime,
          1: new Date(),
        },
        activeRound: 2,
      });

      // console.log('Data uploaded successfully:', {
      //   score,
      //   completeAnswers,
      //   totalScore,
      // });
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setIsLoading(false); // Disable loader
    }
  };

  
  if (isLoading) {
    return <Loader />; // Show loader component
  }
  
  return (
    <>
    <RulesPopup openPopUp={isOpen} key={!isOpen} content={<>
      <h2>Round 1: Quiz Round</h2>
      <p><strong>Format:</strong> This round consists of 10 questions.</p>
      
      <h3>Scoring:</h3>
      <p>1. You will earn 5 points for each correct answer.</p>
      <p>2. If your answer is incorrect or left unanswered, you will receive 0 points.</p>

      <h3>Bonus Points:</h3>
      <p>1. If you answer more than 5 questions correctly, you will receive an additional 5 bonus points.</p>
      <p>2. If you answer more than 8 questions correctly, you will receive an additional 10 bonus points instead of 5.</p>

      <p><strong>Maximum possible score for this round:</strong> 60 points (50 for all correct answers + 10 bonus points).</p>
    </>}/>

    <div className="q-container">
    <div className="container">
      <h1 className="header">ROUND 1: Nature Quiz </h1>
      <div className='rulesButton' onClick={()=>setIsOpen((s)=>!s)}>Rules</div>
      <div className="questionContainer">
        <h2 className="questionText">
          {questions[currentQuestionIndex].question}
        </h2>
        <div className="optionsContainer">
          {questions[currentQuestionIndex].options.map((option) => (
            <button
              key={option.id}
              className={`optionButton ${
                selectedAnswers[questions[currentQuestionIndex].id] === option.id
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleOptionSelect(questions[currentQuestionIndex].id, option.id)
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
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            className="navButton"
            onClick={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(prev + 1, questions.length - 1)
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

export default RoundTwo;
