import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import Dropdown from './dropdown';
import "./dropdown-menu.css"


const DropDownMenu = () => {
    // variable state passed to children
    const [isClub, setIsClub] = useState("All");
    const [leagueIds, setLeagueIds] = useState([]);
    
    // variable state passed up from children
    const [selectedLeague, setSelectedLeague] = useState("All");
    const [selectedClub, setSelectedClub] = useState("All");
    const [selectedSeason, setSelectedSeason] = useState("All");

    const handleLeagueChange = (league) => {
        setSelectedLeague(league);
    };
    
    useEffect(() => {
        const setLeague = async () => {
            if (selectedLeague === "All"){
                setLeagueIds([]);
            }
            else if (selectedLeague === "Europe"){
                setLeagueIds(['654d5c42b322ad18b6591b69', '654d5c33b322ad18b6591b4d', '654d5b642cf103575690b75a', '654d573d1ea4cdf49dec12b1', '654ad4dfab855d69f23058c8', '654ad489ab855d69f23058c7', '654ad0caab855d69f23058c5', '654ad078ab855d69f23058c3','654acfbaab855d69f23058c2','654acf96ab855d69f23058c1', '654acf73ab855d69f23058c0','654acf40ab855d69f23058bf','654ace44ab855d69f23058be','654d733b540628e170d5e1f2', '654d734c540628e170d5e217', '654d734c540628e170d5e218', '654d73bd540628e170d5e2f2', '654d9911962959b8477b2160', '65582aabdeb70a898c3e77bb', ]);
            }
            else{
                setLeagueIds([selectedLeague]);
            }
        };

        setLeague();
    }, [selectedLeague]);
    
    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
    };
    
    const handleClubChange = (club) => {
        setSelectedClub(club);
    };
    
    useEffect(() => {
        const setLeague = async () => {
            if (selectedLeague === "All"){
                setLeagueIds([]);
            }
            else if (selectedLeague === "Europe"){
                setLeagueIds(['654d5c42b322ad18b6591b69', '654d5c33b322ad18b6591b4d', '654d5b642cf103575690b75a', '654d573d1ea4cdf49dec12b1', '654ad4dfab855d69f23058c8', '654ad489ab855d69f23058c7', '654ad0caab855d69f23058c5', '654ad078ab855d69f23058c3','654acfbaab855d69f23058c2','654acf96ab855d69f23058c1', '654acf73ab855d69f23058c0','654acf40ab855d69f23058bf','654ace44ab855d69f23058be','654d733b540628e170d5e1f2', '654d734c540628e170d5e217', '654d734c540628e170d5e218', '654d73bd540628e170d5e2f2', '654d9911962959b8477b2160', '65582aabdeb70a898c3e77bb', ]);
            }
            else{
                setLeagueIds([selectedLeague]);
            }
        };

        setLeague();
    }, [selectedLeague, selectedClub, selectedSeason]);
    
    
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
                    <input type="radio" name="option" value="club" onClick={() => setIsClub(true)}></input>
                </label>
                <label>
                    National Teams
                    <input type="radio" name="option" value="national" onClick={() => setIsClub(false)}></input>
                </label>
                <label>
                    All
                    <input type="radio" name="option" value="All" onClick={() => setIsClub('All')} defaultChecked></input>
                </label>
            </form>
        </div>
    );
};

export default DropDownMenu;