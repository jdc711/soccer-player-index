import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import playerService from '../services/player-service'
import "./player-stats.css"

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
      <div className='playerStats'>
        <table>
            <thead>
                <tr>
                    <th>Season</th>
                    <th>Club</th>
                    <th>League</th>
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
                {playerStats.map((SeasonStat) => (
                    <tr key={SeasonStat._id}>
                        <td>{SeasonStat.season}</td>
                        <td>
                          <Link to={"/club/" + SeasonStat._club_id}>
                            <span>{SeasonStat.club}</span>
                          </Link>
                        </td>
                        <td>
                          <Link to={"/league/" + SeasonStat._league_id}>
                            <span>{SeasonStat.league}</span>
                          </Link>
                        </td>
                        <td>{SeasonStat.appearances === "-" ? 0 : SeasonStat.appearances}</td>
                        <td>{SeasonStat.goals === "-" ? 0 : SeasonStat.goals}</td>
                        <td>{SeasonStat.assists === "-" ? 0 : SeasonStat.assists}</td>
                        <td>{SeasonStat["man-of-the-matches"] === "-" ? 0 : SeasonStat["man-of-the-matches"]}</td>
                        <td>{SeasonStat["average-match-rating"] === "-" ? 0 : SeasonStat["average-match-rating"]}</td>
                        <td>{SeasonStat["yellow-cards"] === "-" ? 0 : SeasonStat["yellow-cards"]}</td>
                        <td>{SeasonStat["red-cards"] === "-" ? 0 : SeasonStat["red-cards"]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    );
};

export default PlayerStats;










