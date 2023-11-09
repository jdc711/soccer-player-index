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
            <Link to="/club">Club</Link>
            <Link to="/player">Player</Link>
            {/* {!isLoggedIn && <Link to="/register">Register</Link>}
            {!isLoggedIn && <Link to="/login">Login</Link>}
            {isLoggedIn && (
                <button onClick={logout}>
                Logout
                </button>
            )} */}
        </nav>
    );
};

export default NavBar;
