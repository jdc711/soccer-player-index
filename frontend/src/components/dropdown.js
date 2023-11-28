import React, { useState, useEffect } from 'react';
import seasonService from '../services/season-service';
import clubService from '../services/club-service';
import leagueService from '../services/league-service';


const Dropdown = ({ category, isClub, leagueIds, onLeagueChange, onSeasonChange, onClubChange }) => { 
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
        if (category === 'seasons') {
            setSelectedSeason(value);
            if (onSeasonChange) onSeasonChange(value)
        }
        else if (category === 'leagues') {
            setSelectedLeague(value);
            if (onLeagueChange){    
                if (value === "All"){
                    onLeagueChange([]); // Call the callback function
                }
                else if (value === "Europe"){
                    onLeagueChange(['654d5c42b322ad18b6591b69', '654d5c33b322ad18b6591b4d', '654d5b642cf103575690b75a', '654d573d1ea4cdf49dec12b1', '654ad4dfab855d69f23058c8', '654ad489ab855d69f23058c7', '654ad0caab855d69f23058c5', '654ad078ab855d69f23058c3','654acfbaab855d69f23058c2','654acf96ab855d69f23058c1', '654acf73ab855d69f23058c0','654acf40ab855d69f23058bf','654ace44ab855d69f23058be','654d733b540628e170d5e1f2', '654d734c540628e170d5e217', '654d734c540628e170d5e218', '654d73bd540628e170d5e2f2', '654d9911962959b8477b2160', '65582aabdeb70a898c3e77bb']);
                }
                else{
                    onLeagueChange([value]); // Call the callback function
                }
            }
        }
        else {
            setSelectedClub(value);
            if (onClubChange) {
                if (value === "All"){
                    onClubChange([])
                }
                else{
                    onClubChange([value])
                }        
            }
        }
    };
    
    const renderHeader = () => {
        if (category === "seasons"){
            return <span>Season</span>
        }
        else if (category === "leagues"){
            return <span>League</span>
        }
        else {
            return <span>Club</span>
        }
    
    }
    
    if (loading) {
        return <div>Loading Clubs...</div>;
    }
      
    if (error) {
        return <div>{error}</div>;
    }
    
    return (
        <div className='dropdown'>
            {renderHeader()}
            <select value={getSelectedValue()} onChange={handleSelectionChange}>
                {renderDropdownItems()}
            </select>
        </div>
    ); 
}

export default Dropdown;
