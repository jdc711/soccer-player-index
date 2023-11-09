const Player = require('../models/player');
const PlayerStats = require('../models/player-stats');


exports.getPlayerProfile = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getPlayerStats = async (req, res) => {
    try {
      const players = await PlayerStats.find();
      res.json(players);
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
    const players = await Player.find({ name: {$regex : nameToSearch} }).exec();
    res.json(players);
    return
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

