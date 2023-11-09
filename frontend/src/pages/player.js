import React from 'react';
import { Link } from 'react-router-dom';
import PlayerProfile from '../components/player-profile'
import PlayerStats from '../components/player-stats'
import { useParams } from 'react-router-dom';


const PlayerPage = () => {
    let { playerId } = useParams();
    
    return (
        <div>
            <PlayerProfile playerId={playerId} />     
            <PlayerStats playerId={playerId} />     
        </div>
    );
};

export default PlayerPage;
