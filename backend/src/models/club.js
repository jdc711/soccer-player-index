const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  leagues: Array,
  "image-url": String,
  "is-club": Boolean
});

module.exports = mongoose.model('Club', ClubSchema, 'club');