/**
 * VidSlides Server — Entry Point
 */

const app = require('./app');
const { scheduleCleanup } = require('./utils/cleanup');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🎬 VidSlides API Server           ║
  ║   Running on port ${PORT}              ║
  ║   http://localhost:${PORT}             ║
  ╚══════════════════════════════════════╝
  `);

  // Schedule temp file cleanup every 30 minutes
  scheduleCleanup();
});
