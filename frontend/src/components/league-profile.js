import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import leagueService from '../services/league-service'
import "./league-profile.css"

const LeagueProfile = ({leagueId}) => {
    const [leagueProfile, setLeagueProfile] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getLeagueProfile = async () => {
        try {
          setLoading(true);
          const leagueProfileData = await leagueService.getLeagueProfile(leagueId);
          setLeagueProfile(leagueProfileData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      getLeagueProfile();
    }, [leagueId]);
  
    if (loading) {
      return <div>Loading League Profile...</div>;
    }
    
    return (
      <div className='clubProfile'>
        <table>
            <tbody>
                <tr>
                    <td><img src={leagueProfile[0]["image-url"]} alt='Image Not Found'></img></td>
                    <td>
                        Name: {leagueProfile[0].name}
                        <br></br>
                        Location: {leagueProfile[0].location}
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    );
};

export default LeagueProfile;










