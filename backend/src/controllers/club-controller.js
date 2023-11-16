const { ObjectId } = require('mongodb');
const Club = require('../models/club');
const League = require('../models/league');
exports.getClubProfile = async (req, res) => {
  const clubId = req.query.clubId; 

  try {
    const clubProfile = await Club.find({_id: clubId});
    res.json(clubProfile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.searchClubsByName = async (req, res) => {
  const nameToSearch = req.query.name; 
  const currentPage = parseInt(req.query.currentPage) || 1;
  const pageLimit = parseInt(req.query.pageLimit) || 10; 
  const skip = (currentPage - 1) * pageLimit;
  try {
    // Use a regular expression to search for a case-insensitive partial match
    const clubs = await Club.find({ name: {$regex : nameToSearch,  $options: "i"}, "is-club":true }).skip(skip).limit(pageLimit);
    const totalClubCount = await Club.countDocuments({ name: {$regex : nameToSearch,  $options: "i"},"is-club":true });

    res.json({
      totalClubCount: totalClubCount,
      totalPages: Math.ceil(totalClubCount / pageLimit),
      currentPage: currentPage,
      clubs: clubs,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};