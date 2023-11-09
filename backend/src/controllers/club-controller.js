const Club = require('../models/club');

exports.getClubProfile = async (req, res) => {
  try {
    const players = await Club.find();
    res.json(players);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.searchByClubName = async (req, res) => {
   // Retrieve the name parameter from the request's query string
   const nameToSearch = req.query.name; // Or req.params.name if you're using route parameters

   try {
     // Use a regular expression to search for a case-insensitive partial match
     const nameRegex = new RegExp(nameToSearch, 'i');
 
     const clubs = await Club.find({ name: nameRegex });
 
     res.json(clubs);
     return
   } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error');
   }
};