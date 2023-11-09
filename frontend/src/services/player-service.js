import axios from 'axios';

const getPlayerProfile = async (playerId) => {
  try {
    const response = await axios.get('/public/player/player-profile', { params: { _id: playerId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPlayerStats = async (playerId) => {
    try {
      const response = await axios.get('/public/player/player-stats', { params: { _id: playerId } });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

const getAllPlayers = async () => {
    try {
      const response = await axios.get('/public/player/all-players', { params: { _id: playerId } });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


export default {
  getPlayerProfile, getPlayerStats, getAllPlayers
};
