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
  const nameToSearch = req.query.name; 
  const currentPage = parseInt(req.query.currentPage) || 1;
  const pageLimit = parseInt(req.query.pageLimit) || 10; 
  const skip = (currentPage - 1) * pageLimit;
  const sortColumn = req.query.sortColumn;
  const sortDirection = req.query.sortDirection;
  try {
    let clubs;
    let totalClubCount;
    if (sortDirection == ""){
      clubs = await Club.find({ name: {$regex : nameToSearch,  $options: "i"}, "is-club":true }).skip(skip).limit(pageLimit);
      totalClubCount = await Club.countDocuments({ name: {$regex : nameToSearch,  $options: "i"},"is-club":true });
    }
    else{
      let sort = {};
      sort[sortColumn] = sortDirection === 'DESC' ? -1 : 1;
      clubs = await Club.find({ name: {$regex : nameToSearch,  $options: "i"}, "is-club":true }).skip(skip).limit(pageLimit).sort(sort);
      totalClubCount = await Club.countDocuments({ name: {$regex : nameToSearch,  $options: "i"},"is-club":true });
    }
    
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

exports.getAllClubs = async (req, res) => {
  let leagueIds = req.query.leagueIds; 
  if (!leagueIds){
    leagueIds = [];
  }
  const isClub = req.query.isClub;
  
  console.log("getAllClubs (backend) leagueIds: ", leagueIds);

  let matchCondition;
  if (leagueIds.length === 0 && isClub === "All"){

    matchCondition = {};
  }
  else if (leagueIds.length === 0){
    matchCondition = { "is-club": isClub };
  }
  else if (isClub === "All"){
    matchCondition = { 
      "leagues": {
        "$elemMatch": {
          "_league_id": { "$in": leagueIds }
        }
      } 
    };

  }
  else{
    matchCondition = { 
      "is-club": isClub,
      "leagues": {
        "$elemMatch": {
          "_league_id": { "$in": leagueIds }
        }
      } 
    };

  }

  try {
    const clubs = await Club.find(matchCondition);
    res.json(clubs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

