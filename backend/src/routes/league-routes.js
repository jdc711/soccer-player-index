const express = require('express');
const router = express.Router();
const playerController = require('../controllers/league-controller');

// Define routes
router.get('/league-profile', playerController.getLeagueProfile);

module.exports = router;
