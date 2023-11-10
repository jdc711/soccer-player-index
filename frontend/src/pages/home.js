import React from 'react';
import { Link } from 'react-router-dom';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'

const HomePage = () => {
    return (
        <div>
            <PlayerList name={""} _currentPage={1}/>            
            <ClubList name={""} _currentPage={1}/>
        </div>
    );
};

export default HomePage;
