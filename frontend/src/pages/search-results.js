// src/pages/SearchResultsPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
// Import any additional components you may have created

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true);
        // try {
        //   const response = await axios.get(`/api/search`, { params: { q: query } });
        //   setResults(response.data);
        //   setError('');
        // } catch (error) {
        //   console.error('Error fetching search results', error);
        //   setError('Failed to load search results.');
        // }
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
      <h1>Search Results</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {/* Render the properties of your result as needed */}
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsPage;
