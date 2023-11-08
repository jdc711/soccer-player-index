const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  name: String,
  location: String
});

module.exports = mongoose.model('League', LeagueSchema, 'league');