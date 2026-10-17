require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // allows the frontend (other laptop) to call this API
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Task API is running' }));
app.use('/api/tasks', taskRoutes);

// 404 + error handlers
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// '0.0.0.0' lets other laptops on the same network reach this server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
  }
});
