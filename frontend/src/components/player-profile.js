import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import playerService from '../services/player-service'
import "./player-profile.css"
const PlayerProfile = ({playerId}) => {
    const [playerProfile, setPlayerProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  
    useEffect(() => {
      const getPlayerProfile = async () => {
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
  
      getPlayerProfile();
    }, [playerId]);
  
    if (loading) {
      return <div>Loading Player Profile...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    return (
      <div className='playerProfile'>
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
                        Club: 
                        {playerProfile[0]["_current_club_id"] === undefined ? (" N/A") : (
                          <Link to={"/club/" + playerProfile[0]._current_club_id}>
                            <span> {playerProfile[0]["current_club_info"][0].name}</span>
                          </Link>
                        )}
                        <br></br>
                        Shirt Number: {playerProfile[0]["shirt-number"]}
                        <br></br>
                        Club History: {playerProfile[0]["club_info"].map((club, index) => (
                          <React.Fragment key={index + '-' + club._id}>
                            <span>
                              <Link to={"/club/" + club._id}>
                                {club.name}
                              </Link>
                            </span>
                            {index < playerProfile[0]["club_info"].length - 1 ? ', ' : ''}
                          </React.Fragment>
                        ))}
                    </td>
                </tr>
            </tbody>
        </table> 
      </div>
    );
};

export default PlayerProfile;