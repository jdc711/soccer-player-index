// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

const NavBar = () => {
//   const { isLoggedIn, logout } = useAuth();

    return (
        <nav>
            <Link to="/">Home</Link>
            <SearchBox />      
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
