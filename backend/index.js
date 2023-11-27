const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
  } else {
    require('dotenv').config({ path: '.env.development' });
  }

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use('/public/player', require('./src/routes/player-routes'));
app.use('/public/club', require('./src/routes/club-routes'));
app.use('/public/league', require('./src/routes/league-routes'));

// Database Connection
db = require('./src/db/db');
db();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "locahost";

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
