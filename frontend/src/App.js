// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LeaguePage from './pages/LeaguePage';
import ClubPage from './pages/ClubPage';
import PlayerPage from './pages/PlayerPage';
import './App.css';

function App() {
  return (
    <Router>
      <nav>
        {/* Navigation links to switch between routes */}
        <Link to="/">Home</Link>
        <Link to="/league">League</Link>
        <Link to="/club">Club</Link>
        <Link to="/player">Player</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/league/:leagueId" element={<LeaguePage />} />
        <Route path="/club/:clubId" element={<ClubPage />} />
        <Route path="/player/:playerId" element={<PlayerPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />

      </Routes>
    </Router>
  );
}

export default App;

