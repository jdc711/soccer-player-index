const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  name: String,
  leagues: Array
});

module.exports = mongoose.model('Club', ClubSchema, 'club');