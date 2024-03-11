import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const searchPlayersByName = async (q, currentPage, pageLimit, sortColumn, sortDirection) => {
  try {
    const response = await axios.get(baseUrl + '/public/player/search-players-by-name', 
    { 
      params: 
        { 
          name: q,
          currentPage: currentPage,
          pageLimit: pageLimit,
          sortColumn: sortColumn,
          sortDirection: sortDirection
        } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const searchClubsByName = async (q,  currentPage, pageLimit, sortColumn, sortDirection) => {
  try {
    const response = await axios.get(baseUrl + '/public/club/search-clubs-by-name', 
    { 
      params: 
      { 
        name: q,
        currentPage: currentPage,
        pageLimit: pageLimit,
        sortColumn: sortColumn,
        sortDirection: sortDirection
      } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  searchPlayersByName, searchClubsByName
};