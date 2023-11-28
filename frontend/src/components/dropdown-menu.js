import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import Dropdown from './dropdown';
import "./dropdown-menu.css"
import playerService from '../services/player-service';


const DropDownMenu = ({onLeagueChange, onSeasonChange, onClubChange, onIsClubChange, onSubmit}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [topGoalScorers, setTopGoalScorers] = useState([]);

    // variable state passed to children
    const [isClub, setIsClub] = useState("All");
    const [leagueIds, setLeagueIds] = useState([]);
    
    // variable state passed up from children
    const [selectedLeagues, setSelectedLeagues] = useState([]);
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState("All");
    
    const handleLeagueChange = (leagues) => {
        setSelectedLeagues(leagues);
        // pass leagues back up to top-performers.js
        onLeagueChange(leagues);
    };
    
    useEffect(() => {
        const setLeague = async () => {
            if (selectedLeagues === "All"){
                setLeagueIds([]);
            }
            else{
                setLeagueIds(selectedLeagues);
            }
        };

        setLeague();
    }, [selectedLeagues]);
    
    const handleSeasonChange = (seasons) => {
        setSelectedSeasons(seasons);
        // pass seasons back up to top-performers.js
        onSeasonChange(seasons);
    };
    
    const handleClubChange = (clubs) => {
        setSelectedClubs(clubs);
        // pass clubs back up to top-performers.js
        onClubChange(clubs);
    };
    
    const handleIsClubChange = (isClub) => {
        setIsClub(isClub);
        onIsClubChange(isClub);
    }
    
    const onClickSubmit = () => {
        onSubmit();
    };
    
    return (
        <div className='dropdownMenu'>
            <Dropdown category="seasons" isClub={isClub} leagueIds={[]} onLeagueChange={null} onSeasonChange={handleSeasonChange} onClubChange={null}>
            </Dropdown>
            <Dropdown category="leagues" isClub={isClub} leagueIds={[]} onLeagueChange={handleLeagueChange} onSeasonChange={null} onClubChange={null}>
            </Dropdown>
            <Dropdown category="clubs" isClub={isClub} leagueIds={leagueIds} onLeagueChange={null} onSeasonChange={null} onClubChange={handleClubChange}>
            </Dropdown>
            <form>
                <label>
                    Club Teams
                    <input type="radio" name="option" value="club" onClick={() => handleIsClubChange(true)}></input>
                </label>
                <label>
                    National Teams
                    <input type="radio" name="option" value="national" onClick={() => handleIsClubChange(false)}></input>
                </label>
                <label>
                    All
                    <input type="radio" name="option" value="All" onClick={() => handleIsClubChange('All')} defaultChecked></input>
                </label>
            </form>
            <button className="submitBtn" onClick={onClickSubmit}>Apply Filter</button>
        </div>
    );
};

export default DropDownMenu;