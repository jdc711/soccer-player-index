const Player = require('../models/league');

exports.getLeagueProfile = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
