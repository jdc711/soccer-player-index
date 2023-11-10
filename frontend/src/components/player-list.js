import React, { useState, useEffect } from 'react';
import searchService from '../services/search-service'; // Adjust the import path as needed
import { Link } from 'react-router-dom';


const PlayerList = ({ name }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await searchService.searchPlayersByName(name, currentPage, 10);
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
    if (currentPage == 1){
      fetchPlayers();
    }
    setCurrentPage(1);
  }, [name]);

  // Fetch players whenever currentPage or name changes
  useEffect(() => {
    fetchPlayers();
  }, [ currentPage]);
  
   // Function to handle page change
   const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div>Loading players...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }

  if (!loading && players.length === 0) {
    return <div>No players found.</div>;
  }
  
  return (
    <div>
      <h1>Players</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Nationality</th>
            <th>Club</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player._id}>
              <td>
                <Link to={"/player/" + player._id}>
                  {player.name}
                </Link>
              </td>
              <td>{player.nationality}</td>
              <td>
                {player["current-club"] === "N/A" ? (player["current-club"]) : (
                  <Link to={"/club/" + player._current_club_id}>
                    {player["current-club"]}
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} disabled={page === currentPage} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
