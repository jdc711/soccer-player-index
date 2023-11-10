const Club = require('../models/club');

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

  const nameToSearch = req.query.name; // Or req.params.name if you're using route parameters
  
  try {
    // Use a regular expression to search for a case-insensitive partial match
    const clubs = await Club.find({ name: {$regex : nameToSearch, $options: "i"} }).exec();
    res.json(clubs);
    return
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};