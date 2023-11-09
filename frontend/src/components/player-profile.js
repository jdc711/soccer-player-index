// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import playerService from '../services/player-service'
// import { useAuth } from '../context/AuthContext';

const PlayerProfile = ({playerId}) => {
    const [playerProfile, setPlayerProfile] = useState([]);
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
                        Name: {playerProfile.name}
                        <br></br>
                        Age: {playerProfile.age}
                        <br></br>
                        Nationality: {playerProfile.nationality}
                        <br></br>
                        Positions: {playerProfile.positions}
                        <br></br>
                        Club: {playerProfile["current-club"]}
                        <br></br>
                        Shirt Number: {playerProfile["shirt-number"]}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default PlayerProfile;










