import React, { useState, useEffect } from 'react';
import searchService from '../services/search-service'; // Adjust the import path as needed

const ClubList = ({name}) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getClubs = async () => {
      try {
        setLoading(true);
        const ClubsData = await searchService.searchClubsByName(name);
        setClubs(ClubsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getClubs();
  }, [name]);

  if (loading) {
    return <div>Loading Clubs...</div>;
  }
  
  if (!loading && clubs.length === 0) {
    return <div></div>;
  }

  return (
    <div>      
      <h1>Clubs</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Leagues</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((Club) => (
            <tr key={Club._id}>
              <td>{Club.name}</td>
              <td>{Club.leagues.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubList;
