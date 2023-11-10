import React, { useState, useEffect } from 'react';
import searchService from '../services/search-service'; // Adjust the import path as needed
import { Link } from 'react-router-dom';

const ClubList = ({name}) => {
  const [clubs, setClubs] = useState([]);
  const [nationalTeams, setNationalTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getClubs = async () => {
      try {
        setLoading(true);
        const ClubsData = await searchService.searchClubsByName(name);
        const filteredClubs = ClubsData.filter(club => club["is-club"] === true);
        const filteredNationalTeams = ClubsData.filter(club => club["is-club"] === false);

        setClubs(filteredClubs);
        setNationalTeams(filteredNationalTeams);

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
    return <div>No clubs found.</div>;
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
              <td>
                <Link to={"/club/" + Club._id}>
                  {Club.name}
                </Link>
              </td>
              <td>
                {Club.leagues.map((league, index) => (
                  <span key={league._league_id}>
                    <Link to={"/league/" + league._league_id}>
                      {league.name}
                    </Link>
                    {index < Club.leagues.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubList;
