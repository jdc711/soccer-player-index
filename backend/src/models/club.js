const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  leagues: Array,
  // _id:{
  //   type: mongoose.Types.ObjectId,
  // },
  // name: {
  //   type: String,
  // },
  // leagues: {
  //   type: Array,
  // },
});

module.exports = mongoose.model('Club', ClubSchema, 'club');