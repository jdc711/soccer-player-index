import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getPlayerProfile = async (playerId) => {
  try {
    const response = await axios.get(baseUrl + '/public/player/player-profile', { params: { playerId: playerId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPlayerStats = async (playerId, clubId, sortColumn, sortDirection) => {
    try {
      const response = await axios.get(baseUrl + '/public/player/player-stats', 
        { 
          params: 
            { 
              playerId: playerId,
              clubId: clubId,
              sortColumn: sortColumn,
              sortDirection: sortDirection
            } 
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

const getAllPlayers = async () => {
    try {
      const response = await axios.get(baseUrl + '/public/player/all-players', {});
      return response.data;
    } catch (error) {
      throw error;
    }
};

export default {
  getPlayerProfile, getPlayerStats, getAllPlayers
};