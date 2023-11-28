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
  
// const getTopAssistersStats = async (leagueIds, clubIds, season, isClub, currentPage, pageLimit) => {
//   try {
//     const response = await axios.get(baseUrl + '/public/player/top-player-stats/assists', 
//       { 
//         params: 
//           { 
//             leagueIds: leagueIds,
//             clubIds: clubIds,
//             season: season,
//             isClub: isClub,
//             currentPage: currentPage,
//             pageLimit: pageLimit
//           } 
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// const getTopMotmsStats = async (leagueIds, clubIds, season, isClub, currentPage, pageLimit) => {
//   try {
//     const response = await axios.get(baseUrl + '/public/player/top-player-stats/man-of-the-matches', 
//       { 
//         params: 
//           { 
//             leagueIds: leagueIds,
//             clubIds: clubIds,
//             season: season,
//             isClub: isClub,
//             currentPage: currentPage,
//             pageLimit: pageLimit
//           } 
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// const getAvgMatchRatingsStats = async (leagueIds, clubIds, season, isClub, currentPage, pageLimit) => {
//   try {
//     const response = await axios.get(baseUrl + '/public/player/top-player-stats/average-match-rating', 
//       { 
//         params: 
//           { 
//             leagueIds: leagueIds,
//             clubIds: clubIds,
//             season: season,
//             isClub: isClub,
//             currentPage: currentPage,
//             pageLimit: pageLimit
//           } 
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
const getTopPerformersStats = async (leagueIds, clubIds, season, isClub, currentPage, pageLimit, category) => {
  try {
    const response = await axios.get(baseUrl + '/public/player/top-player-stats', 
      { 
        params: 
          { 
            leagueIds: leagueIds,
            clubIds: clubIds,
            season: season,
            isClub: isClub,
            currentPage: currentPage,
            pageLimit: pageLimit,
            category: category
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
  getPlayerProfile, getPlayerStats, getAllPlayers, getTopPerformersStats: getTopPerformersStats
};