const PlayerStats = require('../models/player-stats');

exports.getAllSeasons = async (req, res) => {
  const isClub = req.query.isClub;

  let matchCondition;
  if (isClub === "All"){
    matchCondition = {};
  }
  else{
    matchCondition = { "is-club": isClub };
  }

  try {
    const seasons = await PlayerStats.aggregate([
        {
            $match: matchCondition
        },
        {
            $group: {
                _id: "$season" // Group by the season field
            }
        },
        {
            $sort: {
                _id: -1 // Sort the grouped results in descending order
            }
        }
    ]);
    res.json(seasons);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

