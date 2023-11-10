// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from './search-box';
// import { useAuth } from '../context/AuthContext';

const NavBar = () => {
//   const { isLoggedIn, logout } = useAuth();

    return (
        <nav>
            {/* Navigation links to switch between routes */}
            <Link to="/">Home</Link>
            <SearchBox />      
           
        </nav>
    );
};

export default NavBar;
