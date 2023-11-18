import React, { useState, useEffect } from 'react';
import searchService from '../services/search-service'; // Adjust the import path as needed
import { Link } from 'react-router-dom';
import "./club-list.css"

const ClubList = ({name}) => {
  const [clubs, setClubs] = useState([]);
  // const [leaguesPerClub, setLeaguesPerClub] = useState([]);
  const [nationalTeams, setNationalTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("");

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await searchService.searchClubsByName(name,currentPage,10, sortColumn, sortDirection);
      const filteredClubs = response.clubs.filter(club => club["is-club"] === true);
      const filteredNationalTeams = response.clubs.filter(club => club["is-club"] === false);
      setClubs(filteredClubs);
      setNationalTeams(filteredNationalTeams);
      setTotalPages(response.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to fetch clubs.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset current page when name changes
  useEffect(() => {
    if (currentPage == 1){
      fetchClubs();
    }
    setCurrentPage(1);
  }, [name]);

  // Fetch players whenever currentPage or name changes
  useEffect(() => {
    fetchClubs();
  }, [ currentPage, sortColumn, sortDirection]);
  
  // Function to handle page change
  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Function to handle page change
  const changeSortColumn = (newColumn) => {
    // const newDirection = (column === sortColumn && sortDirection === "ASC") ? "DESC" : "ASC";
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
    if (sortDirection === "ASC") return <span className='arrow'>&uarr;</span>; // Upward arrow for ascending
    return <span className='arrow'>&darr;</span>; // Downward arrow for descending
  };

  if (loading) {
    return <div>Loading Clubs...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  
  if (!loading && clubs.length === 0) {
    return <div>No clubs found.</div>;
  }

  return (
    <div className='clubList'>      
      <h1>Clubs</h1>
      <table>
        <thead>
          <tr>
            <th>
              <p onClick={() => changeSortColumn('name')}>Name</p> {renderSortDirectionIcon('name')}
            </th>
            <th>
              <p>Leagues</p>
            </th>
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
                  <span key={Club._id + '-' + league._league_id}>
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
      {/* Pagination controls */}
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

export default ClubList;
