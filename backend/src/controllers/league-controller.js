const League = require('../models/league');

exports.getLeagueProfile = async (req, res) => {
  const leagueId = req.query.leagueId; 

  try {
    const leagueProfile = await League.find({_id: leagueId});
    res.json(leagueProfile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
