import React, { useState, useEffect } from 'react';
import playerService from '../services/player-service'
import "./club-menu.css"

const ClubMenu = ({playerId, onSelectedClubIdChange}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedClubName, setSelectedClubName] = useState("All");
    const [playerProfile, setPlayerProfile] = useState(null);
    
    useEffect(() => {
      const getPlayerStats = async () => {
        try {
          setLoading(true);
          const playerProfileData = await playerService.getPlayerProfile(playerId);
          setPlayerProfile(playerProfileData);
          setError('');
        } catch (error) {
          console.error(error);
          setError("Failed to fetch player profile");
        } finally {
          setLoading(false);
        }
      };
  
      getPlayerStats();
    }, [playerId]);
    
  
    if (loading) {
      return <div className='playerStats loading'>Loading Club Menu...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    return (
        <div className="clubMenu">
          <div key={""} onClick={() => {setSelectedClubName("All"); onSelectedClubIdChange(null)}} className={`clubListMenuItem ${selectedClubName === "All" ? 'active' : ''}`}>
            <span >
              All
            </span>
          </div>
            {playerProfile[0]["club_info"] && playerProfile[0]["club_info"].map((club, index) => (
              <div key={index + '-' + club._id} onClick={() => {setSelectedClubName(club.name); onSelectedClubIdChange(club._id)}} className={`clubListMenuItem ${selectedClubName === club.name ? 'active' : ''}`}>
                <span>
                  {club.name}
                </span>
              </div>
            ))}
        </div>
    );
};

export default ClubMenu;