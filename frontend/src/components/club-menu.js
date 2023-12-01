import React, { useState, useEffect, useRef } from 'react';
import playerService from '../services/player-service'
import "./club-menu.css"

const ClubMenu = ({playerId, onSelectedClubIdChange}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedClubName, setSelectedClubName] = useState("All");
    const [playerProfile, setPlayerProfile] = useState(null);
    const underlineRef = useRef(null);
    const allRef = useRef(null);

    const moveUnderline = (element) => {
        const underline = underlineRef.current;
        if (underline && element) {
          const { offsetWidth: width, offsetLeft: left } = element;
          underline.style.width = `${width}px`;
          underline.style.left = `${left}px`;
        }
      };
    
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
    
    useEffect(() => {
        if (playerProfile) {
          // Ensuring the data is loaded and component has rendered
          moveUnderline(allRef.current);
        }
      }, [playerProfile]); // Dependency on playerProfile      
  
    if (loading) {
      return <div className='playerStats loading'>Loading Club Menu...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    return (
        <div className="clubMenu">
          <div className="underline" ref={underlineRef}></div>
          <div ref={allRef} key={""} onClick={(e) => {setSelectedClubName("All"); onSelectedClubIdChange(null); moveUnderline(e.currentTarget);}} className={`clubListMenuItem ${selectedClubName === "All" ? 'active' : ''}`}>
            <span >
              All
            </span>
          </div>
            {playerProfile[0]["club_info"] && playerProfile[0]["club_info"].map((club, index) => (
              <div key={index + '-' + club._id} onClick={(e) => {setSelectedClubName(club.name); onSelectedClubIdChange(club._id); moveUnderline(e.currentTarget);}} className={`clubListMenuItem ${selectedClubName === club.name ? 'active' : ''}`}>
                <span>
                  {club.name}
                </span>
              </div>
            ))}
        </div>
    );
};

export default ClubMenu;