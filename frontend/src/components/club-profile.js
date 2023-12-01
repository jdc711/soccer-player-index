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
                        Leagues: {clubProfile[0]["league_info"].map((league, index) => (
                          <React.Fragment key={index + '-' + league._id}>
                            <span>
                              <Link to={"/league/" + league._id}>
                                {league.name}
                              </Link>
                            </span>
                            {index < clubProfile[0]["league_info"].length - 1 ? ', ' : ''}
                          </React.Fragment>
                        ))}
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    );
};

export default ClubProfile;