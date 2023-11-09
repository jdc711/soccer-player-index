const Club = require('../models/club');

exports.getClubProfile = async (req, res) => {
  try {
    const players = await Club.find();
    res.json(players);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.searchClubsByName = async (req, res) => {

  const nameToSearch = req.query.name; // Or req.params.name if you're using route parameters
  
  try {
    // Use a regular expression to search for a case-insensitive partial match
    const count = await Club.countDocuments({});
    console.log("count:", count)
    Club.exists({}).then(result => { 
      console.log("RESULT:",result) 
    })
    const allClubs = await Club.find({}).exec();
    console.log("allClubs: ", allClubs)
    const allClubs2 = await Club.find({});
    console.log("allClubs: ", allClubs2)

    const clubs = await Club.find({ name: {$regex : nameToSearch} }).exec();
    console.log("clubs: ", clubs)
    res.json(clubs);
    return
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};