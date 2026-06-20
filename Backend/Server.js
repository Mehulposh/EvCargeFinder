require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/config');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 7000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174' , 'http://localhost:5175'],
  methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' , message: 'Server is healthy'}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});