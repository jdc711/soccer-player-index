import React, { useState, useEffect } from 'react';
import seasonService from '../services/season-service';
import clubService from '../services/club-service';
import leagueService from '../services/league-service';


const Dropdown = ({ category, isClub, leagueIds }) => { 
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
                        console.log("Data: ", data)
                        setSeasons(data);
                        break;
                    case "leagues":
                        data = await leagueService.getAllLeagues(isClub);
                        setLeagues(data);
                        break;
                    default:
                        if (!!leagueIds){
                            console.log("jere1", leagueIds);

                            data = await clubService.getAllClubs(isClub, leagueIds);
                        }
                        else{
                            console.log("jere2", leagueIds);
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
                items = [<option key="All" value="All" onClick={() => setSelectedSeason("All")}>All</option>];
                items = items.concat(seasons.map(season => <option key={season._id} value={season._id} onClick={() => setSelectedSeason(season._id)}>{season._id}</option>));
                break;
            case "leagues":
                items = [<option key="All" value="All" onClick={() => setSelectedLeague("All")}>All</option>];
                items = [<option key="Europe" value="Europe" onClick={() => setSelectedLeague("Europe")}>Europe</option>];
                items = leagues.map(league => <option key={league._id} value={league._id}>{league.name}</option>);
                break;
            default:
                items = [<option key="All" value="All" onClick={() => setSelectedClub("All")}>All</option>];
                items = clubs.map(club => <option key={club._id} value={club._id}>{club.name}</option>);
        }
        return items;
    };
    
    
    if (loading) {
        return <div>Loading Clubs...</div>;
    }
      
    if (error) {
        return <div>{error}</div>;
    }
    
    return (
         <div className='dropdown'>
            <select>
                {renderDropdownItems()}
            </select>
        </div>
    );
    
    
   
}

export default Dropdown;
