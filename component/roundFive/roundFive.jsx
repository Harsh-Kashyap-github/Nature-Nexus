import React, { useState, useContext } from 'react';
import './roundFive.css';
import { RoundFiveQuestions } from '../../data/questions/roundFiveQuestions';
import { db } from '../../src/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '../Loader/Loader';
import { UserContext } from '../../src/UserContext';
import RulesPopup from '../popup/RulesPopup';
// import '../../data/photos'
const RoundFive = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState(
    RoundFiveQuestions.reduce((acc, question) => {
      acc[question.id] = new Array(question.wordLengths.length).fill('');
      return acc;
    }, {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen,setIsOpen]=useState(false)

  const { user, setUser } = useContext(UserContext);

  const handleInputChange = (event, questionId, wordIndex) => {
    const { value } = event.target;
    setCurrentAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      updatedAnswers[questionId][wordIndex] = value.slice(0, RoundFiveQuestions.find(q => q.id === questionId).wordLengths[wordIndex]);
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    setIsLoading(true);

    // Filter out empty answers from currentAnswers
    const filteredAnswers = Object.keys(currentAnswers).reduce((acc, questionId) => {
      acc[questionId] = currentAnswers[questionId].filter(answer => answer.trim() !== '');
      return acc;
    }, {});

    let score = 0;
    console.log(filteredAnswers);

    for (let question of RoundFiveQuestions) {
      try {
        const questionDoc = doc(db, 'Q&A', question.id);
        const questionData = await getDoc(questionDoc);

        if (questionData.exists()) {
          const correctAnswers = questionData.data().words || [];
          const userAnswers = filteredAnswers[question.id] || [];

          // Check if both arrays are identical (case-insensitively)
          const areArraysIdentical = 
            correctAnswers.length === userAnswers.length &&
            correctAnswers.every((ans, index) => ans.toLowerCase() === userAnswers[index].toLowerCase());

          if (areArraysIdentical) {
            score += 5;
          }
        }
      } catch (error) {
        console.error(`Error fetching question ${question.id}:`, error);
      }
    }

    try {
      const userDoc = doc(db, 'users', user.uid);

      await updateDoc(userDoc, {
        'roundScore.4': score,
      });

      const userData = (await getDoc(userDoc)).data();
      const totalScore = (userData?.totalScore || 0) + score;
      await updateDoc(userDoc, {
        totalScore,
      });

      await updateDoc(userDoc, {
        'submitedAnswer.4': filteredAnswers,
      });

      await updateDoc(userDoc, {
        'roundSubmitTime.4': serverTimestamp(),
      });

      await updateDoc(userDoc, {
        activeRound: 5,
      });

      await updateDoc(userDoc, {
        isGameOver:true,
      });

      setUser({
        ...user,
        roundScore: {
          ...user.roundScore,
          4: score,
        },
        totalScore,
        submitedAnswer: {
          ...user.submitedAnswer,
          4: filteredAnswers,
        },
        roundSubmitTime: {
          ...user.roundSubmitTime,
          4: new Date(),
        },
        activeRound: 5,
      });

      // console.log('Data uploaded successfully:', {
      //   score,
      //   filteredAnswers,
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

  const currentQuestion = RoundFiveQuestions[currentQuestionIndex];

  return (
    <>
    <RulesPopup setIsOpen={isOpen} key={!isOpen} content={<>
      <h2>Round 4: Meme Round</h2>
      <p><strong>Format:</strong> This round consists of 5 questions.</p>
      
      <h3>Scoring:</h3>
      <p>1. You will earn 5 points for each fully correct answer.</p>
      <p>2. No partial marks will be awarded. If your answer is incomplete or has any incorrect details, you will receive 0 points.</p>

      <p><strong>No bonus points are available in this round.</strong></p>
      
      <p><strong>Maximum possible score for this round:</strong> 25 points.</p>
    </>}/>
      <div className='q-container'>
        <div className="x-container">
          <h1 className="header">ROUND 4: Meme Causes</h1>
          <div className='rulesButton' onClick={()=>setIsOpen((s)=>!s)}>Rules</div>
          <div className="questionContainer">
            <img src={currentQuestion.photoPath} alt={`Question ${currentQuestion.id}`} className="questionImage" />
            <div className="answerInputs">
              {currentQuestion.wordLengths.map((exactLength, wordIndex) => (
                <input
                  key={wordIndex}
                  type="text"
                  className="answerInput"
                  placeholder={`Word ${wordIndex + 1} (${exactLength} characters)`}
                  value={currentAnswers[currentQuestion.id][wordIndex]}
                  onChange={(event) => handleInputChange(event, currentQuestion.id, wordIndex)}
                />
              ))}
            </div>
          </div>
          <div className="navigationContainer">
            <button className="navButton" onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            {currentQuestionIndex === RoundFiveQuestions.length - 1 ? (
              <button className="submitButton" onClick={handleSubmit}>
                Submit
              </button>
            ) : (
              <button className="navButton" onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, RoundFiveQuestions.length - 1))}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoundFive;
