import React from 'react';
import './Rules.css';

function Rules() {
  return (
    <div className="rulesContainer">
      <div className="rulesHeader">
        <h1 className="rulesTitle">Game Rules</h1>
      </div>
      <div className="rulescontent">
        <div className="round">
          <h2 className="roundTitle">Round 1: Quiz Round</h2>
          <p><strong>Format:</strong> This round consists of 10 questions.</p>
          <h3 className="scoringTitle">Scoring:</h3>
          <p>1. You will earn 5 points for each correct answer.</p>
          <p>2. If your answer is incorrect or left unanswered, you will receive 0 points.</p>
          <h3 className="bonusPointsTitle">Bonus Points:</h3>
          <p>1. If you answer more than 5 questions correctly, you will receive an additional 5 bonus points.</p>
          <p>2. If you answer more than 8 questions correctly, you will receive an additional 10 bonus points instead of 5.</p>
          <p><strong>Maximum possible score for this round:</strong> 60 points (50 for all correct answers + 10 bonus points).</p>
        </div>

        <div className="round">
          <h2 className="roundTitle">Round 2: Video Round</h2>
          <p><strong>Format:</strong> This round consists of 5 questions based on short video clips. You must answer the questions according to the content of the video.</p>
          <h3 className="scoringTitle">Scoring:</h3>
          <p>1. You will earn 5 points for each correct answer.</p>
          <p>2. If your answer is incorrect or left unanswered, you will receive 0 points.</p>
          <h3 className="bonusPointsTitle">Bonus Points:</h3>
          <p>1. If you answer more than 3 questions correctly, you will receive an additional 5 bonus points.</p>
          <p><strong>Maximum possible score for this round:</strong> 30 points (25 for all correct answers + 5 bonus points).</p>
        </div>

        <div className="round">
          <h2 className="roundTitle">Round 3: Situation Round</h2>
          <p><strong>Format:</strong> This round consists of 5 questions, each presenting a situation with three possible options. You must choose the best possible response.</p>
          <h3 className="scoringTitle">Scoring:</h3>
          <p>1. Best option: 5 points.</p>
          <p>2. Second-best option: 3 points.</p>
          <p>3. Least suitable option: 1 point.</p>
          <p><strong>Maximum possible score for this round:</strong> 25 points (if you choose the best option for all 5 questions).</p>
        </div>

        <div className="round">
          <h2 className="roundTitle">Round 4: Meme Round</h2>
          <p><strong>Format:</strong> This round consists of 5 questions.</p>
          <h3 className="scoringTitle">Scoring:</h3>
          <p>1. You will earn 5 points for each fully correct answer.</p>
          <p>2. No partial marks will be awarded. If your answer is incomplete or has any incorrect details, you will receive 0 points.</p>
          <p><strong>No bonus points are available in this round.</strong></p>
          <p><strong>Maximum possible score for this round:</strong> 25 points.</p>
        </div>
      </div>
    </div>
  );
}

export default Rules;
