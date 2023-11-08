const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // To use environment variables

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
require('./src/db/db');
connectDB();

// Routes
app.use('/public/players', require('./src/routes/player-routes'));
app.use('/public/clubs', require('./src/routes/club-routes'));
app.use('/public/leagues', require('./src/routes/league-routes'));
app.use('/public/player-stats', require('./src/routes/player-stats-routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
