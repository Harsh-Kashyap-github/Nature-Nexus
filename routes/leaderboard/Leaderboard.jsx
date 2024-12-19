import React, { useEffect, useState, useContext } from 'react';
import './Leaderboard.css';
import { db } from '../../src/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { UserContext } from '../../src/UserContext';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { user } = useContext(UserContext);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    const playersCollection = collection(db, 'users');
    const snapshot = await getDocs(playersCollection);

    const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const sortedPlayers = players.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.activeRound !== a.activeRound) return b.activeRound - a.activeRound;
      return new Date(a.roundSubmitTime[a.activeRound]?.toDate()) - new Date(b.roundSubmitTime[b.activeRound]?.toDate());
    });

    setLeaderboardData(sortedPlayers.slice(0, 20));
    setTotalPlayers(players.length);

    const userIndex = sortedPlayers.findIndex(player => player.id === user.uid);
    if (userIndex !== -1) {
      setUserRank(userIndex + 1);
    }
    setLastUpdated(new Date().toLocaleString());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [user]);

  if (!user){
    return(
      <div className='leader-container'>
         <h1 className='leader-title'>Login to see the Leaderboard</h1>
      </div>
    )
  }
  return (
    <div className='leader-container'>
      <h1 className='leader-title'>Leaderboard</h1>
      <button className='refresh-button' onClick={fetchLeaderboardData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh'}
      </button>
      {lastUpdated && (
        <p className='last-updated'>Last Updated: {lastUpdated}</p>
      )}
      {user && userRank && (
        <div className='user-rank'>
          <p>
            Your Rank: <span className='highlight'>{userRank}</span> / {totalPlayers}
          </p>
          <p>
            Your Score: <span className='highlight'>{user.totalScore}</span>
          </p>
        </div>
      )}
      <table className='leader-table'>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Last Round Submitted</th>
            <th>Submission Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player, index) => (
            <tr key={player.id} className={player.id === user.uid ? 'highlight-row' : ''}>
              <td>{index + 1}</td>
              <td>{player.name || 'Anonymous'}</td>
              <td>{player.totalScore}</td>
              <td>{player.activeRound -1 || '-'}</td>
              <td>
                {player.roundSubmitTime[player.activeRound-1]?.toDate()?.toLocaleString() || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

