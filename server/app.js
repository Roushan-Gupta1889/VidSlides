/**
 * Express App — Layer 1
 * Core server setup with CORS, static files, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const slidesRoutes = require('./routes/slides');
const exportRoutes = require('./routes/export');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────

// CORS — allow frontend dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Static Files ───────────────────────────────────────

// Serve extracted frames as static files
const framesDir = path.join(__dirname, 'tmp', 'frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}
app.use('/frames', express.static(framesDir));

// ── API Routes ─────────────────────────────────────────

app.use('/api', slidesRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VidSlides API',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// ── Error Handling ─────────────────────────────────────

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Endpoint not found', type: 'NOT_FOUND' },
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
