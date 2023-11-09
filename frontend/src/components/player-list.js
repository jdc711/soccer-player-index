import React, { useState, useEffect } from 'react';
import searchService from '../services/search-service'; // Adjust the import path as needed


const PlayerList = ({ name }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayers = async () => {
      try {
        setLoading(true);
        const playersData = await searchService.searchPlayersByName(name);
        setPlayers(playersData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPlayers();
  }, [name]);

  if (loading) {
    return <div>Loading players...</div>;
  }

  if (!loading && players.length === 0) {
    return <div></div>;
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
              <td>{player.name}</td>
              <td>{player.nationality}</td>
              <td>{player["current-club"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerList;
