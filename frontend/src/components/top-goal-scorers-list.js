import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import playerService from '../services/player-service'
import "./player-stats.css"

const TopGoalScorersList = ({selectedLeagues, selectedClubs, selectedSeasons, isClub}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [topGoalScorers, setTopGoalScorers] = useState([]);

    useEffect(() => {
      const getTopGoalScorers = async () => {
          try {
              console.log("selectedLeagues: ", selectedLeagues);
              console.log("selectedClubs: ", selectedClubs);
              console.log("selectedSeasons: ", selectedSeasons);
              console.log("isClub: ", isClub);
              setLoading(true);
              const topGoalScorersData = await playerService.getTopGoalScorersStats(selectedLeagues, selectedClubs, selectedSeasons, isClub);
              setTopGoalScorers(topGoalScorersData);
              setError('');
            } catch (error) {
              console.error(error);
              setError("Failed to fetch top goal scorers");
            } finally {
              setLoading(false);
            }
      };

      getTopGoalScorers();
  }, [selectedLeagues, selectedClubs, selectedSeasons, isClub]);
  
    if (loading) {
      return <div>Loading Top Goal Scorers...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    return (
      <div className='topGoalScorersList'>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Season</th>
                    <th>League</th>
                    <th>Team</th>
                    <th>Goals</th>
                </tr>
            </thead>
            <tbody>
                {topGoalScorers.map((SeasonStat) => (
                    <tr key={SeasonStat._id}>
                        <td>
                          <Link to={"/player/" + SeasonStat._player_id}>
                            <span>{SeasonStat.name}</span>
                          </Link>
                        </td>
                        <td>
                          {SeasonStat.season}
                        </td>
                        <td>
                          <Link to={"/league/" + SeasonStat._league_id}>
                            <span>{SeasonStat.league}</span>
                          </Link>
                        </td>
                        <td>
                          <Link to={"/club/" + SeasonStat._club_id}>
                            <span>{SeasonStat.league}</span>
                          </Link>
                        </td>
                        <td>{SeasonStat.goals}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    );
};

export default TopGoalScorersList;