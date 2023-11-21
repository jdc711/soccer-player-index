import React from 'react';
import { useParams } from 'react-router-dom';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'

const SearchResultsPage = () => {
  let { query } = useParams();

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
