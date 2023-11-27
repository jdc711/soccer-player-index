import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import Dropdown from './dropdown';
import "./dropdown-menu.css"


const DropDownMenu = () => {
    const [isClub, setIsClub] = useState("All");
    const [leagueIds, setLeagueIds] = useState([]);
    
    return (
        <div className='dropdownMenu'>
            <Dropdown category="seasons" isClub={isClub} leagueIds={[]}>
            </Dropdown>
            <Dropdown category="leagues" isClub={isClub} leagueIds={[]}>
            </Dropdown>
            <Dropdown category="clubs" isClub={isClub} leagueIds={leagueIds}>
            </Dropdown>
            {/* <form>
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
                    <input type="radio" name="option" value="All" onClick={() => setIsClub('All')} checked></input>
                </label>
            </form> */}
        </div>
    );
};

export default DropDownMenu;