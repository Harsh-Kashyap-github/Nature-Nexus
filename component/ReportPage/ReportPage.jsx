import React, { useContext } from 'react';
import './ReportPage.css';
import { UserContext } from '../../src/UserContext';
import { RoundFiveQuestions } from '../../data/questions/roundFiveQuestions';
import { roundThreeQuestions } from '../../data/questions/roundThreeQuestions';
import { RoundTwoQuestions } from '../../data/questions/roundTwoQuestions';
import { RoundFourQuestions } from '../../data/questions/roundFourQuestions';

const roundData = [
  { round: 1, questions: RoundTwoQuestions },
  { round: 2, questions: roundThreeQuestions },
  { round: 3, questions: RoundFourQuestions },
  { round: 4, questions: RoundFiveQuestions },
];

const ReportPage = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div className="report-loading">Loading user data...</div>;
  }

  return (
    <div className="report-container">
      <div className="user-info">
        <h1>THANK YOU</h1>
        <h2 className="user-name">{user.name}</h2>
        <p className="total-score">Total Score: {user.totalScore || 0}</p>
      </div>

      {roundData.map((round) => (
        <div key={round.round} className="round-report">
          <h1 className="report-header">Round {round.round} Report</h1>
          <p className="round-score">Round Score: {user.roundScore?.[round.round] || 0} points</p>
          <p className="submit-time">Submitted at: {user.roundSubmitTime?.[round.round] ? new Date(user.roundSubmitTime[round.round].seconds * 1000).toLocaleString() : 'Not submitted'}</p>

          {round.questions.map((question, index) => (
            <div key={question.id} className="question-report">
              <h2 className="question-title">Question {index + 1}</h2>
              {question.photoPath ? (
                <img src={question.photoPath} alt={`Question ${index + 1}`} className="question-image" />
              ) : (
                <p className="written-question">{question.question}</p>
              )}
              <div className="answers-container">
                <h3>Your Answer:</h3>
                <p className="answer-item">
                  {round.round === 4
                    ? (user.submitedAnswer?.[round.round]?.[question.id] || []).join(', ')
                    : question.options?.find(opt => opt.id === user.submitedAnswer?.[round.round]?.[question.id])?.text || 'No answer provided'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReportPage;

