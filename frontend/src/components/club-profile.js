import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import clubService from '../services/club-service'
import "./club-profile.css"

const ClubProfile = ({clubId}) => {
    const [clubProfile, setClubProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const getClubProfile = async () => {
        try {
          setLoading(true);
          const clubProfileData = await clubService.getClubProfile(clubId);
          setClubProfile(clubProfileData);
          setError('');
        } catch (error) {
          console.error(error);
          setError("Failed to fetch club profile");
        } finally {
          setLoading(false);
        }
      };
  
      getClubProfile();
    }, [clubId]);
  
    if (loading) {
      return <div>Loading Club Profile...</div>;
    }
    
    if (error) {
      return <div>{error}</div>;
    }
    
    return (
      <div className='clubProfile'>
        <table>
            <tbody>
                <tr>
                    <td>                    
                      <img src={clubProfile[0]["image-url"]} alt='Image Not Found'></img>
                    </td>
                    <td>
                        Name: {clubProfile[0].name}
                        <br></br>
                        Leagues: {clubProfile[0].leagues.map((league, index) => (
                          <span key={league._league_id}>
                            <Link to={"/league/" + league._league_id}>
                              {league.name}
                            </Link>
                            {index < clubProfile[0].leagues.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    );
};

export default ClubProfile;