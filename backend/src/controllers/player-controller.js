const Player = require('../models/player');
const PlayerStats = require('../models/player-stats');

exports.getPlayerProfile = async (req, res) => {
  const playerId = req.query.playerId; 
  try {
    const playerProfile = await Player.find({_id: playerId});
    res.json(playerProfile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getPlayerStats = async (req, res) => {
  const playerId = req.query.playerId; 
  const clubId = req.query.clubId; 
  const sortColumn = req.query.sortColumn;
  const sortDirection = req.query.sortDirection;
  try {
    let playerStats;
    if (!clubId){
      if (sortDirection == ""){
        playerStats = await PlayerStats.find({_player_id: playerId});
      }
      else{
        let sort = {};
        sort[sortColumn] = sortDirection === 'DESC' ? -1 : 1;
        playerStats = await PlayerStats.find({_player_id: playerId}).sort(sort);
      }  
    }
    else{
      if (sortDirection == ""){
        playerStats = await PlayerStats.find({_player_id: playerId, _club_id: clubId});
      }
      else{
        let sort = {};
        sort[sortColumn] = sortDirection === 'DESC' ? -1 : 1;
        playerStats = await PlayerStats.find({_player_id: playerId, _club_id: clubId}).sort(sort);
      }  
    }
    res.json(playerStats);  
  } 
  catch (err) {
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
  const nameToSearch = req.query.name; 
  const currentPage = parseInt(req.query.currentPage) || 1;
  const pageLimit = parseInt(req.query.pageLimit) || 10; 
  const skip = (currentPage - 1) * pageLimit;
  const sortColumn = req.query.sortColumn;
  const sortDirection = req.query.sortDirection;

  try {
    let players;
    let totalPlayerCount;
    if (sortDirection == ""){
      players = await Player.find({ name: {$regex : nameToSearch,  $options: "i"} }).skip(skip).limit(pageLimit);
      totalPlayerCount = await Player.countDocuments({ name: {$regex : nameToSearch,  $options: "i"} });
    }
    else{
      let sort = {};
      sort[sortColumn] = sortDirection === 'DESC' ? -1 : 1;
      players = await Player.find({ name: {$regex : nameToSearch,  $options: "i"} }).skip(skip).limit(pageLimit).sort(sort); ;
      totalPlayerCount = await Player.countDocuments({ name: {$regex : nameToSearch,  $options: "i"} });
    }
   
    res.json({
      totalPlayerCount: totalPlayerCount,
      totalPages: Math.ceil(totalPlayerCount / pageLimit),
      currentPage:currentPage,
      players: players
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTopGoalScorersStats = async (req, res) => {
  let leagueIds = req.query.leagueIds; 
  if (!leagueIds){
    leagueIds = [];
  }
  let clubIds = req.query.clubIds; 
  if (!clubIds){
    clubIds = [];
  }
  const season = req.query.season;
  const isClub = req.query.isClub;

  // console.log("backend leagueIds: ", leagueIds);
  // console.log("backend clubIds: ", clubIds);
  // console.log("backend season: ", season);
  // console.log("backend isClub: ", isClub);
  
  let matchCondition;
  if (leagueIds.length === 0 && clubIds.length === 0 && season === "All" ){
    matchCondition = {};
  }
  else if (leagueIds.length === 0 && clubIds.length === 0){
    let seasons = season.split("/");
    seasons.push(season);
    matchCondition = { 
      "season": { "$in": seasons },
    };
  }
  else if (leagueIds.length === 0 && season === "All"){
    matchCondition = { 
      "_club_id": { "$in": clubIds },      
    };
  }
  else if (clubIds.length === 0 && season === "All"){
    matchCondition = { 
      "_league_id": { "$in": leagueIds },
    };
  }
  else if (leagueIds.length === 0){
    let seasons = season.split("/");
    seasons.push(season);
    matchCondition = { 
      "_club_id": { "$in": clubIds },     
      "season": { "$in": seasons },
    };
  }
  else if (clubIds.length === 0){
    let seasons = season.split("/");
    seasons.push(season);
    matchCondition = { 
      "_league_id": { "$in": leagueIds },     
      "season": { "$in": seasons },
    };
  }
  else if (season === "All"){
    matchCondition = { 
      "_league_id": { "$in": leagueIds },  
      "_club_id": { "$in": clubIds },     
    };
  }
  else {
    let seasons = season.split("/");
    seasons.push(season);
    matchCondition = { 
      "_league_id": { "$in": leagueIds },     
      "season": { "$in": seasons },
      "_club_id": { "$in": clubIds },      
    };
  }
  
  let isClubMatchCondition;
  if (isClub === "All"){
    isClubMatchCondition = {};
  }
  else{
    let isClubBoolean = isClub === "true";
    isClubMatchCondition = { 'is-club': isClubBoolean };
  }

  try {
    let topGoalScorersStats = await PlayerStats.aggregate([
      { $match: 
        /* your query conditions here */ 
        matchCondition
      },
      { 
        $lookup: {
          from: 'club', // the name of the collection in MongoDB
          localField: '_club_id', // field from the player-stats collection
          foreignField: '_id', // field from the clubs collection
          as: 'club_info' // array field added to player-stats documents
        }
      },
      { $unwind: '$club_info' }, // converts club_info from array (with one object) into object
      { 
        $addFields: {
          'is-club': '$club_info.is-club' // Add the is-club field from club_info to the document
        } 
      },
      { $match: isClubMatchCondition }, 
      { $sort: { 'goals': -1 } }, // Sorting by goals in descending order
      { 
        $project: {
          'club_info': 0 // Exclude the club_info field
          // All other fields from player-stats will be included automatically
        } 
      }
    ]);
   
    res.json(topGoalScorersStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
