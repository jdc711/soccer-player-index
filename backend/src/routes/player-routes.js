const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player-controller');

router.get('/player-profile', playerController.getPlayerProfile);
router.get('/player-stats', playerController.getPlayerStats);
router.get('/top-player-stats/goals', playerController.getTopGoalScorersStats);
// router.get('/top-player-stats/assists', playerController.getTopAssistersStats);
// router.get('/top-player-stats/man-of-the-matches', playerController.getTopMotmStats);
// router.get('/top-player-stats/average-match-rating', playerController.getTopAvgMatchRatingStats);
router.get('/all-players', playerController.getAllPlayers);
router.get('/search-players-by-name', playerController.searchByPlayerName);

module.exports = router;
