const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club-controller');

// Define routes
router.get('/club-profile', clubController.getClubProfile);
router.get('/search-clubs-by-name', clubController.searchClubsByName);


module.exports = router;
