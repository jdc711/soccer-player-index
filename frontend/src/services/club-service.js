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

export default {
  getClubProfile
};