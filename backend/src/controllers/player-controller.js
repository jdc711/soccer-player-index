const Player = require('../models/player');
const PlayerStats = require('../models/player-stats');


exports.getPlayerProfile = async (req, res) => {
  const playerId = req.query.playerId; 
  try {
    const playerProfile = await Player.find({_id: playerId});
    res.json(playerProfile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getPlayerStats = async (req, res) => {
  const playerId = req.query.playerId; 
  try {
    const playerStats = await PlayerStats.find({_player_id: playerId});
    res.json(playerStats);     
    } catch (err) {
      res.status(500).send('Server Error');
  }
};

exports.getAllPlayers = async (req, res) => {
    try {
      const players = await PlayerStats.find();
      res.json(players);
    } catch (err) {
      res.status(500).send('Server Error');
    }
};

exports.searchByPlayerName = async (req, res) => {
  const nameToSearch = req.query.name; 
  const currentPage = parseInt(req.query.currentPage) || 1;
  const pageLimit = parseInt(req.query.pageLimit) || 10; 
  const sortColumn = req.query.sortColumn;
  const sortDirection = req.query.sortDirection;

  
  const skip = (currentPage - 1) * pageLimit;
  try {
    let players;
    let totalPlayerCount;
    if (sortDirection == ""){
      players = await Player.find({ name: {$regex : nameToSearch,  $options: "i"} }).skip(skip).limit(pageLimit);
      totalPlayerCount = await Player.countDocuments({ name: {$regex : nameToSearch,  $options: "i"} });
    }
    else{
      let sort = {};
      sort[sortColumn] = sortDirection === 'DESC' ? -1 : 1;
      players = await Player.find({ name: {$regex : nameToSearch,  $options: "i"} }).skip(skip).limit(pageLimit).sort(sort); ;
      totalPlayerCount = await Player.countDocuments({ name: {$regex : nameToSearch,  $options: "i"} });
    }
   
    console.log("players: ", players)
    res.json({
      totalPlayerCount: totalPlayerCount,
      totalPages: Math.ceil(totalPlayerCount / pageLimit),
      currentPage:currentPage,
      players: players
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

