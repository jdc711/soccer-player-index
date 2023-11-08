// src/components/SearchBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const validateSearchTerm = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={validateSearchTerm}>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBox;
