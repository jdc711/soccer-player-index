const Club = require('../models/club');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.getClubProfile = async (req, res) => {
  let clubId = req.query.clubId; 
  clubId = new ObjectId(clubId);
  try {
    // const clubProfile = await Club.find({_id: clubId});
    const clubProfile = await Club.aggregate([
      { $match: {_id: clubId} },
      { $lookup: { from: 'league', localField: '_league_ids', foreignField: '_id', as: 'league_info' } },
    ]);
    
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
    let matchCondition = { name: {$regex : nameToSearch,  $options: "i"}, "is-club":true };
    if (sortDirection === ""){
      // clubs = await Club.find({ name: {$regex : nameToSearch,  $options: "i"}, "is-club":true }).skip(skip).limit(pageLimit);
      // totalClubCount = await Club.countDocuments({ name: {$regex : nameToSearch,  $options: "i"},"is-club":true });

      clubs = await Club.aggregate([
        { $match: matchCondition },
        { $lookup: { from: 'league', localField: '_league_ids', foreignField: '_id', as: 'league_info' } }, 
      ]).skip(skip).limit(pageLimit);
      
      totalClubCount = await Club.countDocuments(matchCondition);
    }
    else{
      let sort = {};
      sort[sortColumn] = sortDirection === 'DESC' ? -1 : 1;
      // clubs = await Club.find({ name: {$regex : nameToSearch,  $options: "i"}, "is-club":true }).skip(skip).limit(pageLimit).sort(sort);
      // totalClubCount = await Club.countDocuments({ name: {$regex : nameToSearch,  $options: "i"},"is-club":true });
      
      clubs = await Club.aggregate([
        { $match: matchCondition },
        { $lookup: { from: 'league', localField: '_league_ids', foreignField: '_id', as: 'league_info' } },
      ]).sort(sort).skip(skip).limit(pageLimit);
      
      
      totalClubCount = await Club.countDocuments(matchCondition);
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
  else {
    leagueIds = leagueIds.map(id => new ObjectId(id));
  }
  const isClub = req.query.isClub;
  
  let matchCondition;
  if (leagueIds.length === 0 && isClub === "All"){

    matchCondition = {};
  }
  else if (leagueIds.length === 0){
    matchCondition = { "is-club": isClub };
  }
  else if (isClub === "All"){
    // matchCondition = { 
    //   "leagues": {
    //     "$elemMatch": {
    //       "_league_id": { "$in": leagueIds }
    //     }
    //   } 
    // };
    
    matchCondition = {
      "_league_ids": {"$in": leagueIds}
    };

  }
  else{
    // matchCondition = { 
    //   "is-club": isClub,
    //   "leagues": {
    //     "$elemMatch": {
    //       "_league_id": { "$in": leagueIds }
    //     }
    //   } 
    // };
    
    matchCondition = {
      "is-club": isClub,
      "_league_ids": {"$in": leagueIds}
    };

  }

  try {
    // const clubs = await Club.find(matchCondition);
    const clubs = await Club.aggregate([
      { $match: matchCondition },
      { $lookup: { from: 'league', localField: '_league_ids', foreignField: '_id', as: 'league_info' } },
    ]);
    

    res.json(clubs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

