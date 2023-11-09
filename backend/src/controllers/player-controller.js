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
  const nameToSearch = req.query.name; // Or req.params.name if you're using route parameters
  try {
    // Use a regular expression to search for a case-insensitive partial match
    

    const players = await Player.find({ name: {$regex : nameToSearch,  $options: "i"} }).exec();
    console.log("players: ", players)

    res.json(players);
    return
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

