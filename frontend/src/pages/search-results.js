// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import searchService from '../services/search-service';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'
// Import any additional components you may have created

const SearchResultsPage = () => {
  let { query } = useParams();
  
  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  
  // useEffect(() => {
  //   const fetchResults = async () => {
  //     if (query) {
  //       setLoading(true);
  //       try {
  //         const data = await searchService.search(query);
  //         setResults(data);
  //         setError('');
  //       } catch (error) {
  //         console.error('Error fetching search results', error);
  //         setError('Failed to load search results.');
  //       }
  //       setLoading(false);
  //     }
  //   };

  //   fetchResults();
  // }, [query]);
  
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
