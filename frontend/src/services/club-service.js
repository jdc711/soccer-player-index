import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getClubProfile = async (clubId) => {
  try {
    const response = await axios.get(baseUrl + '/public/club/club-profile', { params: { clubId: clubId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllClubs = async(isClub, leagueIds) => {
  try {
    const response = await axios.get(baseUrl + '/public/club/all-clubs', { params: { leagueIds: leagueIds, isClub: isClub } });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export default {
  getClubProfile, getAllClubs
};