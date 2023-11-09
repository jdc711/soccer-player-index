// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import playerService from '../services/player-service'
// import { useAuth } from '../context/AuthContext';

const PlayerStats = ({playerId}) => {
    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getPlayerStats = async () => {
        try {
          setLoading(true);
          const playerStatsData = await playerService.getPlayerStats(playerId);
          setPlayerStats(playerStatsData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      getPlayerStats();
    }, [playerId]);
  
    if (loading) {
      return <div>Loading Player Stats...</div>;
    }
    
    return (
        <table>
            <thead>
                <tr>
                    <th>Club</th>
                    <th>League</th>
                    <th>Season</th>
                    <th>Matches</th>
                    <th>Goals</th>
                    <th>Assists</th>
                    <th>MOTM</th>
                    <th>Avg Match Rating</th>
                    <th>Yellow Cards</th>
                    <th>Red Cards</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{playerStats.club}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default PlayerStats;










