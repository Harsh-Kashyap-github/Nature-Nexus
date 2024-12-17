import React, { useState, useContext } from 'react';
import { RoundFourQuestions } from '../../data/questions/roundFourQuestions';
import { db } from '../../src/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '../Loader/Loader';
import { UserContext } from '../../src/UserContext';
import RulesPopup from '../popup/RulesPopup';

const questions = RoundFourQuestions;

const RoundFour = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);
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

    const completeAnswers = questions.reduce((acc, question) => {
      acc[question.id] = selectedAnswers[question.id] || null;
      return acc;
    }, {});

    let score = 0;

    for (const [questionId, selectedOption] of Object.entries(completeAnswers)) {
      if (selectedOption) {
        try {
          const questionDoc = doc(db, 'Q&A', questionId);
          const questionData = await getDoc(questionDoc);

          if (questionData.exists()) {
            const optionScores = questionData.data().scores || {}; // Get the score object
            score += optionScores[selectedOption] || 0; // Add the score of the selected option
          }
        } catch (error) {
          console.error(`Error fetching question ${questionId}:`, error);
        }
      }
    }

    try {
      const userDoc = doc(db, 'users', user.uid);

      // Upload the round score
      await updateDoc(userDoc, {
        'roundScore.3': score,
      });

      // Update total score
      const userData = (await getDoc(userDoc)).data();
      const totalScore = (userData?.totalScore || 0) + score;
      await updateDoc(userDoc, {
        totalScore,
      });

      // Upload the answers
      await updateDoc(userDoc, {
        'submitedAnswer.3': completeAnswers,
      });

      // Upload the submission time
      await updateDoc(userDoc, {
        'roundSubmitTime.3': serverTimestamp(),
      });

      // Change the active round
      await updateDoc(userDoc, {
        activeRound: 4,
      });

      // Update the user context
      setUser({
        ...user,
        roundScore: {
          ...user.roundScore,
          3: score,
        },
        totalScore,
        submitedAnswer: {
          ...user.submitedAnswer,
          3: completeAnswers,
        },
        roundSubmitTime: {
          ...user.roundSubmitTime,
          3: new Date(),
        },
        activeRound: 4,
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
    <RulesPopup setIsOpen={isOpen} key={!isOpen} content={<>
      <h2>Round 3: Situation Round</h2>
      <p><strong>Format:</strong> This round consists of 5 questions, each presenting a situation with three possible options. You must choose the best possible response.</p>
      
      <h3>Scoring:</h3>
      <p>1. Best option: 5 points.</p>
      <p>2. Second-best option: 3 points.</p>
      <p>3. Least suitable option: 1 point.</p>

      <p><strong>Maximum possible score for this round:</strong> 25 points (if you choose the best option for all 5 questions).</p>
    </>}/>
    <div className="q-container">
      <div className="container">
        <h1 className="header">ROUND 3: Situation Response Test</h1>
        <div className='rulesButton' onClick={()=>setIsOpen((s)=>!s)}>Rules</div>
        <div className="questionContainer">
          <h2 className="questionText">
            {questions[currentQuestionIndex].scenario}
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

export default RoundFour;