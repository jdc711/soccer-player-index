const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  age: Number,
  nationality: String,
  positions: String,
  "current-club": String,
  "shirt-number": Number,
  "club-history": Array
});

module.exports = mongoose.model('Player', PlayerSchema, 'player');