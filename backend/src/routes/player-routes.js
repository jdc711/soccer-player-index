const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player-controller');

// Define routes
router.get('/player-profile', playerController.getPlayerProfile);
router.get('/player-stats', playerController.getPlayerStats);
// router.post('/', playerController.createPlayer);

module.exports = router;
