import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getLeagueProfile = async (leagueId) => {
  try {
    const response = await axios.get(baseUrl + '/public/league/league-profile', { params: { leagueId: leagueId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllLeagues = async (isClubCompetition) => {
  try {
    const response = await axios.get(baseUrl + '/public/league/all-leagues', { params: { isClubCompetition: isClubCompetition } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getLeagueProfile, getAllLeagues
};
