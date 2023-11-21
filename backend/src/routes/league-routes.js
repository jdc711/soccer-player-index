const express = require('express');
const router = express.Router();
const playerController = require('../controllers/league-controller');

router.get('/league-profile', playerController.getLeagueProfile);

module.exports = router;
