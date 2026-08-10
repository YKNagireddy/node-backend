require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const personRoutes = require('./routes/personRoutes');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'business-portfolio-backend' }));
app.use('/api/person', personRoutes);

// Basic error handler (e.g. multer file-too-large / wrong file type)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
