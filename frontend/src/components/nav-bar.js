import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
import "./nav-bar.css"
const NavBar = () => {
    return (
        <nav>
            {/* Navigation links to switch between routes */}
            <Link to="/">Home</Link>
            <SearchBox />      
           
        </nav>
    );
};

export default NavBar;