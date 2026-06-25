/**
 * Backend server entry point.
 *
 * Configures Express middleware, connects to MongoDB, and mounts
 * admin and user API routes.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/config');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 7000;

// Connect to MongoDB before accepting requests
connectDB();

// Enable CORS for local frontend ports and JSON request parsing
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Mount API route groups
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Server is healthy' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});