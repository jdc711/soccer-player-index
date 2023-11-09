import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import playerService from '../services/player-service'
// import { useAuth } from '../context/AuthContext';

const PlayerProfile = ({playerId}) => {
    const [playerProfile, setPlayerProfile] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getPlayerProfile = async () => {
        try {
          setLoading(true);
          const playerProfileData = await playerService.getPlayerProfile(playerId);
          setPlayerProfile(playerProfileData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      getPlayerProfile();
    }, [playerId]);
  
    if (loading) {
      return <div>Loading Player Profile...</div>;
    }
    
    return (
        <table>
            <tbody>
                <tr>
                    <td>Image</td>
                    <td>
                        Name: {playerProfile[0].name}
                        <br></br>
                        Age: {playerProfile[0].age}
                        <br></br>
                        Nationality: {playerProfile[0].nationality}
                        <br></br>
                        Positions: {playerProfile[0].positions}
                        <br></br>
                        Club: {playerProfile[0]["current-club"]}
                        <br></br>
                        Shirt Number: {playerProfile[0]["shirt-number"]}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default PlayerProfile;










