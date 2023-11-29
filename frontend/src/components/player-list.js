import React, { useState, useEffect } from 'react';
import searchService from '../services/search-service'; // Adjust the import path as needed
import { Link } from 'react-router-dom';
import "./player-list.css"

const PlayerList = ({ name }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("");


  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await searchService.searchPlayersByName(name, currentPage, 10, sortColumn, sortDirection);
      setPlayers(response.players);
      setTotalPages(response.totalPages);
      setError('');
    } catch (error) {
      console.error(error);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  };

  // Reset current page when name changes
  useEffect(() => {
    if (currentPage === 1){
      fetchPlayers();
    }
    setCurrentPage(1);
  }, [name]);

  // Fetch players whenever currentPage or name changes
  useEffect(() => {
    fetchPlayers();
  }, [ currentPage, sortColumn, sortDirection]);
  
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };
  
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
    return <div className='playerList loading'>Loading players...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }

  if (!loading && players.length === 0) {
    return <div>No players found.</div>;
  }
  
  return (
    <div className='playerList'>
      <h1>Players</h1>
      <table>
        <thead>
          <tr>
            <th>
              <p onClick={() => changeSortColumn('name')}>Name</p> {renderSortDirectionIcon('name')}
            </th>
            <th>
              <p onClick={() => changeSortColumn('nationality')}>Nationality</p> {renderSortDirectionIcon('nationality')}
            </th>
            <th>
              <p onClick={() => changeSortColumn('current-club')}>Club</p> {renderSortDirectionIcon('current-club')}
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player._id}>
              <td>
                <Link to={"/player/" + player._id}>
                  <span>{player.name}</span>
                </Link>
              </td>
              <td>{player.nationality}</td>
              <td>
                {player["current-club"] === "N/A" ? (player["current-club"]) : (
                  <Link to={"/club/" + player._current_club_id}>
                    <span>{player["current-club"]}</span>
                  </Link>
                )}
              </td>
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

export default PlayerList;