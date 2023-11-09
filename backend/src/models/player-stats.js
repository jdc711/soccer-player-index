const mongoose = require('mongoose');

const PlayerStatsSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  _player_id: mongoose.Types.ObjectId,
  name: String,
  club: String,
  season: String,
  league: String,
  appearances: String,
  goals: String,
  "yellow-cards": String,
  "red-cards": String,
  "man-of-the-matches": String,
  "average-match-rating": String,
});

module.exports = mongoose.model('PlayerStats', PlayerStatsSchema, 'player-stats');