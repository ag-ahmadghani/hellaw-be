const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test Route
app.get('/', (req, res) => {
  res.send('API Hellaw berjalan 🚀');
});

// Routes
const agendaRoutes = require('./routes/agendaRoutes');
app.use('/api/agendas', agendaRoutes);

const galeryRoutes = require('./routes/galeryRoutes');
app.use('/api/galerys', galeryRoutes);

// Listener
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
