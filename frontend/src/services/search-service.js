import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const searchPlayersByName = async (q) => {
console.log("q: ", q)
  try {
    const response = await axios.get(baseUrl + '/public/player/search-players-by-name', { params: { name: q } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const searchClubsByName = async (q) => {
  try {
    const response = await axios.get(baseUrl + '/public/club/search-clubs-by-name', { params: { name: q } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  searchPlayersByName, searchClubsByName
};
