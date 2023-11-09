import React from 'react';
import { Link } from 'react-router-dom';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'

const HomePage = () => {
    return (
        <div>
            <PlayerList />
            <ClubList />
        </div>
    );
};

export default HomePage;
