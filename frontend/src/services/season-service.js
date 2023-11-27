import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getAllSeasons = async(isClub) => {
  try {
    const response = await axios.get(baseUrl + '/public/league/all-clubs', { params: { leagueIds: leagueIds, isClub: isClub } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
    getAllSeasons
};