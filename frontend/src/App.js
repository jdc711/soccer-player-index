// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/home';
import LeaguePage from './pages/league';
import ClubPage from './pages/club';
import PlayerPage from './pages/player';
import SearchResultsPage from './pages/search-results'
import LoginPage from './pages/user/login';
import RegisterPage from './pages/user/register';
import NavBar from './components/nav-bar'

import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/league/:leagueId" element={<LeaguePage />} />
        <Route path="/club/:clubId" element={<ClubPage />} />
        <Route path="/player/:playerId" element={<PlayerPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

