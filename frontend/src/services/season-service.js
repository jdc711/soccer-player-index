import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getAllSeasons = async(isClub) => {
  // console.log("getAllSeasons (Frontend)");
  try {
    const response = await axios.get(baseUrl + '/public/season/all-seasons', { params: { isClub: isClub } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
    getAllSeasons
};