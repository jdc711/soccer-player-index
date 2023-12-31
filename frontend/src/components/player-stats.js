import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import playerService from '../services/player-service'
import "./player-stats.css"

const PlayerStats = ({playerId, selectedClubId}) => {
    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState("name");
    const [sortDirection, setSortDirection] = useState("");
    const [error, setError] = useState('');
    
    useEffect(() => {
      const getPlayerStats = async () => {
        try {
          setLoading(true);
          const playerStatsData = await playerService.getPlayerStats(playerId, selectedClubId, sortColumn, sortDirection);
          setPlayerStats(playerStatsData);
          setError('');
        } catch (error) {
          console.error(error);
          setError("Failed to fetch player stats");
        } finally {
          setLoading(false);
        }
      };
  
      getPlayerStats();
    }, [playerId, sortColumn, sortDirection, selectedClubId]);
    
    const changeSortColumn = (newColumn) => {
      let newDirection = "";
      if (newColumn !== sortColumn){
        newDirection = "ASC";
      }
      else{
        if (sortDirection === ""){
          newDirection = "ASC";
        }
        else if (sortDirection === "ASC"){
          newDirection = "DESC";
        }
        else {
          newDirection = "";
        }
      }
      
      setSortColumn(newColumn);
      setSortDirection(newDirection);
    };
    
    const renderSortDirectionIcon = (column) => {
      if (sortColumn !== column || sortDirection === "") return null;
      if (sortDirection === "ASC") return <span className='arrow'>&uarr;</span>;
      return <span className='arrow'>&darr;</span>;
    };
  
    if (loading) {
      return <div className='playerStats loading'>Loading Player Stats...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    return (
      <div className='playerStats'>
        <div className='table-container'>
        <table>
            <thead>
                <tr>
                    <th>
                      <p onClick={() => changeSortColumn('season')}>Season</p> {renderSortDirectionIcon('season')}
                    </th>
                    <th>Club</th>
                    <th>League</th>
                    <th>
                      <p onClick={() => changeSortColumn('appearances')}>Matches</p> {renderSortDirectionIcon('appearances')}
                    </th>
                    <th>
                      <p onClick={() => changeSortColumn('goals')}>Goals</p> {renderSortDirectionIcon('goals')}
                    </th>
                    <th>
                      <p onClick={() => changeSortColumn('assists')}>Assists</p> {renderSortDirectionIcon('assists')}
                    </th>
                    <th>
                      <p onClick={() => changeSortColumn("man-of-the-matches")}>MOTM</p> {renderSortDirectionIcon("man-of-the-matches")}
                    </th>
                    <th>
                      <p onClick={() => changeSortColumn("average-match-rating")}>Avg Match Rating</p> {renderSortDirectionIcon("average-match-rating")}
                    </th>
                    <th>
                      <p onClick={() => changeSortColumn("yellow-cards")}>Yellow Cards</p> {renderSortDirectionIcon("yellow-cards")}
                    </th>
                    <th>
                      <p onClick={() => changeSortColumn("red-cards")}>Red Cards</p> {renderSortDirectionIcon("red-cards")}
                    </th>
                </tr>
            </thead>
            <tbody>
                {playerStats.map((SeasonStat, index) => (
                    <tr key={index + '-' + SeasonStat._id}>
                        <td>{SeasonStat.season}</td>
                        <td>
                          <Link to={"/club/" + SeasonStat._club_id}>
                            <span>{SeasonStat["club_info"][0].name}</span>
                          </Link>
                        </td>
                        <td>
                          <Link to={"/league/" + SeasonStat._league_id}>
                            <span>{SeasonStat["league_info"][0].name}</span>
                          </Link>
                        </td>
                        <td>{SeasonStat.appearances}</td>
                        <td>{SeasonStat.goals}</td>
                        <td>{SeasonStat.assists}</td>
                        <td>{SeasonStat["man-of-the-matches"]}</td>
                        <td>{SeasonStat["average-match-rating"]}</td>
                        <td>{SeasonStat["yellow-cards"]}</td>
                        <td>{SeasonStat["red-cards"]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
      </div>
    );
};

export default PlayerStats;