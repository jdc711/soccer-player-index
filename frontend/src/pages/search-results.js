// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import searchService from '../services/search-service';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'
// Import any additional components you may have created

const SearchResultsPage = () => {
  let { query } = useParams();
  
  if (!query){
    return (
      <div>
        <PlayerList name={""} />            
        <ClubList name={""}/>
      </div>
    );
  }

  return (
    <div>
      <PlayerList name={query} />            
      <ClubList name={query}/>
    </div>
  );
};

export default SearchResultsPage;
