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
  // Retrieve the name parameter from the request's query string
  console.log("req.query: ", req.query)
  console.log("req.query.name: ", req.query.name)

  const nameToSearch = req.query.name; // Or req.params.name if you're using route parameters
  
  console.log("nameToSearch: ", nameToSearch.toString())
  try {
    // Use a regular expression to search for a case-insensitive partial match
    const count = await Player.countDocuments({});
    console.log("count:", count)
    Player.exists({}).then(result => { 
      console.log("RESULT:",result) 
    })
    const allPlayers = await Player.find({}).exec();
    console.log("allPlayers: ", allPlayers)
    const allPlayers2 = await Player.find({});
    console.log("allPlayers: ", allPlayers2)

    const players = await Player.find({ name: {$regex : nameToSearch} }).exec();
    console.log("players: ", players)
    res.json(players);
    return
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

