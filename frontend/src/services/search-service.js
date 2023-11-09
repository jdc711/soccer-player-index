import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const searchPlayersByName = async (q) => {
  try {
    const response = await axios.get('/public/player/search-players-by-name', { params: { name: q } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const searchClubsByName = async (q) => {
  try {
    const response = await axios.get('/public/club/search-clubs-by-name', { params: { name: q } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  searchPlayersByName, searchClubsByName
};
