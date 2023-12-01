import React, { useState } from 'react';
import PlayerProfile from '../components/player-profile'
import PlayerStats from '../components/player-stats'
import { useParams } from 'react-router-dom';
import ClubMenu from '../components/club-menu';

const PlayerPage = () => {
    let { playerId } = useParams();
    // passed up from club-menu.js
    const [selectedClubId, setSelectedClubId] = useState(null);
    
    const handleSelectedClubIdChange = (selectedClubId) => {
        // pass to player-stats.js
        setSelectedClubId(selectedClubId);
    };
    return (
        <div>
            <PlayerProfile playerId={playerId} />  
            <ClubMenu playerId={playerId} onSelectedClubIdChange={handleSelectedClubIdChange} />
            <PlayerStats playerId={playerId} selectedClubId={selectedClubId} />     
        </div>
    );
};

export default PlayerPage;
