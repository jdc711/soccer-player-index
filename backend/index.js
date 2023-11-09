const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // To use environment variables

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
db = require('./src/db/db');
db();

// Routes
app.use('/public/player', require('./src/routes/player-routes'));
app.use('/public/club', require('./src/routes/club-routes'));
app.use('/public/league', require('./src/routes/league-routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
