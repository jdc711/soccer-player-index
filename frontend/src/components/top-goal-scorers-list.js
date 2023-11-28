import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import playerService from '../services/player-service'
import "./player-stats.css"

const TopGoalScorersList = ({selectedLeagues, selectedClubs, selectedSeasons, isClub}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [topGoalScorers, setTopGoalScorers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    const getTopGoalScorers = async () => {
      try {
          // console.log("selectedLeagues: ", selectedLeagues);
          // console.log("selectedClubs: ", selectedClubs);
          // console.log("selectedSeasons: ", selectedSeasons);
          // console.log("isClub: ", isClub);
          setLoading(true);
          const response = await playerService.getTopGoalScorersStats(selectedLeagues, selectedClubs, selectedSeasons, isClub, currentPage, 10);
          setTopGoalScorers(response.topGoalScorersStats);
          setTotalPages(response.totalPages);

          setError('');
        } catch (error) {
          console.error(error);
          setError("Failed to fetch top goal scorers");
        } finally {
          setLoading(false);
        }
    };
    
    useEffect(() => {
      getTopGoalScorers();
    }, [currentPage]);
    
    // set page to 1 when filter changes
    useEffect(() => {
      if (currentPage === 1){
        getTopGoalScorers();
      }
      setCurrentPage(1);
    }, [selectedLeagues, selectedClubs, selectedSeasons, isClub]);
  
    const changePage = (newPage) => {
      setCurrentPage(newPage);
    };
  
    if (loading) {
      return <div>Loading Top Goal Scorers...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    return (
      <div className='topGoalScorersList'>
        <h1>Top Goalscorers</h1>
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
                            <span>{SeasonStat.club}</span>
                          </Link>
                        </td>
                        <td>{SeasonStat.goals}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} className="pagination-button" disabled={page === currentPage} onClick={() => changePage(page)}>
            {page}
          </button>
        ))}
      </div>
      </div>
    );
};

export default TopGoalScorersList;