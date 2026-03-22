const express    = require('express');
const dotenv     = require('dotenv');
const cors       = require('cors');
const connectDB  = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/news',         require('./routes/news'));
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/admin',        require('./routes/admin'));

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 Luminaris University API is running',
    version: '1.0.0',
  });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});