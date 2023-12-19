const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this line

if (process.env.NODE_ENV === 'prod') {
    require('dotenv').config({ path: '.env.production' });
  } else {
    require('dotenv').config({ path: '.env.development' });
  }

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Routes
app.use('/public/player', require('./src/routes/player-routes'));
app.use('/public/club', require('./src/routes/club-routes'));
app.use('/public/league', require('./src/routes/league-routes'));
app.use('/public/season', require('./src/routes/season-routes'));

// // Serve static files from the React app in production
// if (process.env.NODE_ENV === 'prod') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
//   });
// }

// Database Connection
db = require('./src/db/db');
db();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
