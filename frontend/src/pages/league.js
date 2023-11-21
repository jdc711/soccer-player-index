import React from 'react';
import { useParams } from 'react-router-dom';
import LeagueProfile from '../components/league-profile';

const LeaguePage = () => {
    let { leagueId } = useParams();
    return (
        <div>
            <LeagueProfile leagueId={leagueId} />     
        </div>
    );
};

export default LeaguePage;
