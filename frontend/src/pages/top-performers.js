import React, { useState, useEffect } from 'react';
import PlayerList  from '../components/player-list'
import ClubList  from '../components/club-list'
import DropDownMenu from '../components/dropdown-menu';
import TopPerformersList from '../components/top-performers-list';

const TopPerformersPage = () => {

    // passed up from dropdown menu
    const [selectedLeagues, setSelectedLeagues] = useState([]);
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState("2023/2024");
    const [isClub, setIsClub] = useState("All");
    const [submitStatus, setSubmitStatus] = useState(false);

    const handleLeagueChange = (league) => {
        setSelectedLeagues(league);
    };
    
    const handleSeasonChange = (season) => {
        setSelectedSeasons(season);
    };
    
    const handleClubChange = (club) => {
        setSelectedClubs(club);
    };
    
    const handleIsClubChange = (isClub) => {
        setIsClub(isClub);
    };
    
    const handleOnSubmit = () => {
    
        setSubmitStatus(!submitStatus);
    };
    
    return (
        <div>
            <DropDownMenu onLeagueChange={handleLeagueChange} onSeasonChange={handleSeasonChange} onClubChange={handleClubChange} onIsClubChange={handleIsClubChange} onSubmit={handleOnSubmit} />     
            <TopPerformersList selectedLeagues={selectedLeagues} selectedClubs={selectedClubs} selectedSeasons={selectedSeasons} isClub={isClub} submitStatus = {submitStatus} category="goals"/>
            <TopPerformersList selectedLeagues={selectedLeagues} selectedClubs={selectedClubs} selectedSeasons={selectedSeasons} isClub={isClub} submitStatus = {submitStatus} category="assists"/>
            <TopPerformersList selectedLeagues={selectedLeagues} selectedClubs={selectedClubs} selectedSeasons={selectedSeasons} isClub={isClub} submitStatus = {submitStatus} category="man-of-the-matches"/>
            <TopPerformersList selectedLeagues={selectedLeagues} selectedClubs={selectedClubs} selectedSeasons={selectedSeasons} isClub={isClub} submitStatus = {submitStatus} category="average-match-rating"/>

        </div>
    );
};

export default TopPerformersPage;
