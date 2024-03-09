import React from 'react';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'

const HomePage = () => {
    return (
        <div>
            <p>Helllo!</p>
            <PlayerList name={""} _currentPage={1}/>            
            <ClubList name={""} _currentPage={1}/>
        </div>
    );
};

export default HomePage;
