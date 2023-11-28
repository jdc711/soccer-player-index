import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import playerService from '../services/player-service'
import "./top-performers-list.css"

const TopPerformersList = ({selectedLeagues, selectedClubs, selectedSeasons, isClub, submitStatus, category}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [topPerformers, setTopPerformers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    const getTopPerformers = async () => {
      try {
          setLoading(true);
          let response;
          
          response = await playerService.getTopPerformersStats(selectedLeagues, selectedClubs, selectedSeasons, isClub, currentPage, 10, category);
          setTopPerformers(response.topGoalScorersStats);
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
      getTopPerformers();
    }, [currentPage]);
    
    useEffect(()=>{
      if (currentPage === 1){
        getTopPerformers();
      }
      setCurrentPage(1);
    }, [submitStatus])
  
    const changePage = (newPage) => {
      setCurrentPage(newPage);
    };
  
    if (loading) {
      return <div>Loading Top Goal Scorers...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    const renderHeader = () => {
      if (category === "goals"){
        return <h1>Top Goalscorers</h1>;
      }
      else if (category === "assists"){
        return <h1>Top Assisters</h1>;
      }
      else if (category === "man-of-the-matches"){
        return <h1>Most Man of the Matches</h1>;
      }
      else {
        return <h1>Highest Avg Match Rating</h1>;
      }
    };
    
    const renderLastColumn = () => {
      if (category === "goals"){
        return <th>Goals</th>;
      }
      else if (category === "assists"){
        return <th>Assists</th>;
      }
      else if (category === "man-of-the-matches"){
        return <th>MOTM</th>;
      }
      else {
        return <th>Avg Match Rating</th>;
      }
    };
    
    return (
      <div className='topPerformersList'>
        {renderHeader()}
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Season</th>
                    <th>League</th>
                    <th>Team</th>
                    {renderLastColumn()}
                </tr>
            </thead>
            <tbody>
                {topPerformers.map((SeasonStat) => (
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
                        {category === "goals" && <td>{SeasonStat.goals}</td>}
                        {category === "assists" && <td>{SeasonStat.assists}</td>}
                        {category === "man-of-the-matches" && <td>{SeasonStat["man-of-the-matches"]}</td>}
                        {category === "average-match-rating" && <td>{SeasonStat["average-match-rating"]}</td>}                    
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

export default TopPerformersList;