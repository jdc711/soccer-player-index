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

// exports.createPlayer = async (req, res) => {
//   try {
//     const newPlayer = new Player(req.body);
//     const player = await newPlayer.save();
//     res.json(player);
//   } catch (err) {
//     res.status(500).send('Server Error');
//   }
// };