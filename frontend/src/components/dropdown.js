import React, { useState, useEffect } from 'react';
import seasonService from '../services/season-service';
import clubService from '../services/club-service';
import leagueService from '../services/league-service';


const Dropdown = ({ category, isClub, leagueIds, onLeagueChange }) => { 
    const [clubs, setClubs] = useState([]);
    const [seasons, setSeasons] = useState([]);   
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSeason, setSelectedSeason] = useState("All")
    const [selectedLeague, setSelectedLeague] = useState("All")
    const [selectedClub, setSelectedClub] = useState("All")
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let data;

                switch (category) {
                    case "seasons":
                        data = await seasonService.getAllSeasons(isClub);
                        setSeasons(data);
                        break;
                    case "leagues":
                        data = await leagueService.getAllLeagues(isClub);
                        setLeagues(data);
                        break;
                    default:
                        if (!!leagueIds){
                            data = await clubService.getAllClubs(isClub, leagueIds);
                        }
                        else{
                            data = await clubService.getAllClubs(isClub, []);
                        }
                        setClubs(data);
                }

                setError('');
            } catch (error) {
                console.error(error);
                setError(`Failed to fetch ${category}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isClub, leagueIds]);
    
    const renderDropdownItems = () => {
        let items = [];
        switch (category) {
            case "seasons":
                items = [<option key="All" value="All">All</option>];
                items = items.concat(seasons.map(season => <option key={season._id} value={season._id}>{season._id}</option>));
                break;
            case "leagues":
                items = [<option key="All" value="All">All</option>];
                items = items.concat([<option key="Europe" value="Europe">Europe</option>]);
                items = items.concat(leagues.map(league => <option key={league._id} value={league._id}>{league.name}</option>));
                break;
            default:
                items = [<option key="All" value="All">All</option>];
                items = items.concat(clubs.map(club => <option key={club._id} value={club._id}>{club.name}</option>));
        }
        return items;
    };
    
    const getSelectedValue = () => {
        switch (category) {
            case 'seasons':
                return selectedSeason;
            case 'leagues':
                return selectedLeague;
            default:
                return selectedClub;
        }
    };
    
    const handleSelectionChange = e => {
        const value = e.target.value;
        if (category === 'seasons') setSelectedSeason(value);
        else if (category === 'leagues') {
            setSelectedLeague(value);
            if (onLeagueChange) onLeagueChange(value); // Call the callback function
        }
        else setSelectedClub(value);
    };
    
    if (loading) {
        return <div>Loading Clubs...</div>;
    }
      
    if (error) {
        return <div>{error}</div>;
    }
    
    return (
         <div className='dropdown'>
            <select value={getSelectedValue()} onChange={handleSelectionChange}>
                {renderDropdownItems()}
            </select>
        </div>
    ); 
}

export default Dropdown;
