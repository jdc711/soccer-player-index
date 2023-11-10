// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import searchService from '../services/search-service';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'
// Import any additional components you may have created

const SearchResultsPage = () => {
  let { query } = useParams();
  // const [currentPage, setCurrentPage] = useState(1);
  
  // useEffect(() => {
  //   // Reset the current page to 1 every time the searchTerm changes
  //   setCurrentPage(1);
  //   console.log("pageNumber on searchResults: ",currentPage )
  //   // Navigate to the first page of new search results when searchTerm changes
  //   // navigate(`/search-results/${searchTerm}/1`);
  // }, [query]);


  if (!query){
    return (
      <div>
        <PlayerList name={""}/>            
        <ClubList name={""}/>
      </div>
    );
  }

  return (
    <div>
      <PlayerList name={query}/>            
      <ClubList name={query}/>
    </div>
  );
};

export default SearchResultsPage;
