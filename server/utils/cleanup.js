/**
 * Temp File Cleanup Utility
 * Removes old video/frame files to prevent disk bloat
 */

const fs = require('fs');
const path = require('path');

const STORAGE_DIR = path.join(__dirname, '..', 'tmp');
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

/**
 * Remove files older than MAX_AGE_MS from a directory
 * @param {string} dir 
 */
function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;

  const now = Date.now();
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    try {
      const stat = fs.statSync(fullPath);
      if (now - stat.mtimeMs > MAX_AGE_MS) {
        if (entry.isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fullPath);
        }
        console.log(`[cleanup] Removed: ${entry.name}`);
      }
    } catch (err) {
      console.error(`[cleanup] Error removing ${entry.name}:`, err.message);
    }
  }
}

/**
 * Run cleanup on all temp directories
 */
function runCleanup() {
  console.log('[cleanup] Running temp file cleanup...');
  cleanDir(path.join(STORAGE_DIR, 'videos'));
  cleanDir(path.join(STORAGE_DIR, 'frames'));
  cleanDir(path.join(STORAGE_DIR, 'exports'));
  console.log('[cleanup] Cleanup complete');
}

/**
 * Schedule periodic cleanup
 * @param {number} intervalMs - default 30 minutes
 */
function scheduleCleanup(intervalMs = 30 * 60 * 1000) {
  // Run once on startup
  runCleanup();
  // Then periodically
  setInterval(runCleanup, intervalMs);
}

module.exports = { runCleanup, scheduleCleanup };
