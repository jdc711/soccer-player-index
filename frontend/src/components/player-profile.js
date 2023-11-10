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
                    <td><img src={playerProfile[0]["image-url"]} alt='Image Not Found'></img></td>
                    <td>
                        Name: {playerProfile[0].name}
                        <br></br>
                        Age: {playerProfile[0].age}
                        <br></br>
                        Nationality: {playerProfile[0].nationality}
                        <br></br>
                        Positions: {playerProfile[0].positions}
                        <br></br>
                        <Link to={"/club/" + playerProfile[0]._current_club_id}>
                          Club: {playerProfile[0]["current-club"]}
                        </Link>
                        <br></br>
                        Shirt Number: {playerProfile[0]["shirt-number"]}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default PlayerProfile;










