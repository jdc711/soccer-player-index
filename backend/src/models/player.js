const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  name: String,
  age: Number,
  nationality: String,
  positions: String,
  "current-club": String,
  "shirt-number": String,
  "club-history": Array
});

module.exports = mongoose.model('Player', PlayerSchema, 'player');