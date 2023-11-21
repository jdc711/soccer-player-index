import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./search-box.css"

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const validateSearchTerm = async (e) => {
    e.preventDefault();
    
    navigate('/search-results/' + searchTerm.trim());
    
  };

  return (
    <div className='searchBox'>
      <form onSubmit={validateSearchTerm}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;