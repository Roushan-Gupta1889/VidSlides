/**
 * Video Service — Layer 1 Core
 * Handles video metadata (pre-flight) and downloading via yt-dlp
 */

const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const VIDEOS_DIR = path.join(__dirname, '..', 'tmp', 'videos');

// Ensure directory exists
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

/**
 * Pre-flight: Get video metadata WITHOUT downloading
 * Uses yt-dlp --dump-json (instant, no bandwidth cost)
 * 
 * @param {string} url - YouTube URL
 * @returns {Promise<{title, duration, thumbnail, videoId, uploader}>}
 */
async function getVideoMeta(url) {
  // Try to find yt-dlp — check npm package first, then system PATH
  const ytdlpPath = getYtdlpPath();

  return new Promise((resolve, reject) => {
    execFile(ytdlpPath, [
      '--dump-json',
      '--no-warnings',
      '--no-playlist',
      url
    ], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('[videoService] yt-dlp meta error:', stderr || error.message);
        return reject(new Error('Failed to fetch video metadata. Check if the URL is valid.'));
      }

      try {
        const info = JSON.parse(stdout);
        resolve({
          videoId: info.id,
          title: info.title || 'Untitled Video',
          duration: info.duration || 0, // seconds
          thumbnail: info.thumbnail || null,
          uploader: info.uploader || 'Unknown',
          uploadDate: info.upload_date || null,
        });
      } catch (parseErr) {
        reject(new Error('Failed to parse video metadata'));
      }
    });
  });
}

/**
 * Download video at 720p max (slides don't need 4K)
 * 
 * @param {string} url - YouTube URL
 * @param {string} videoId - Used for filename
 * @param {object} options - { startTime, endTime } for chunk downloads
 * @returns {Promise<string>} Path to downloaded video
 */
async function downloadVideo(url, videoId, options = {}) {
  const ytdlpPath = getYtdlpPath();
  const outputPath = path.join(VIDEOS_DIR, `${videoId}.mp4`);

  // If merged file already exists (cached), skip download
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    if (stat.size > 0) {
      console.log(`[videoService] Using cached video: ${videoId}`);
      return outputPath;
    }
  }

  // Clean up any stale partial/unmerged files from previous attempts
  cleanStaleFiles(videoId);

  // Get ffmpeg path from ffmpeg-static for yt-dlp merge
  const ffmpegPath = getFFmpegPath();

  const args = [
    '-f', 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best',
    '--merge-output-format', 'mp4',
    '--ffmpeg-location', ffmpegPath,
    '--no-playlist',
    '--no-warnings',
    '--no-part', // Avoid Windows file locking rename issues
    '-o', outputPath,
    url
  ];

  // For chunk downloads, add time range
  if (options.startTime !== undefined && options.endTime !== undefined) {
    args.push('--download-sections', `*${options.startTime}-${options.endTime}`);
  }

  return new Promise((resolve, reject) => {
    console.log(`[videoService] Downloading video: ${videoId}...`);
    console.log(`[videoService] Using ffmpeg at: ${ffmpegPath}`);
    const proc = execFile(ytdlpPath, args, {
      maxBuffer: 50 * 1024 * 1024,
      timeout: 15 * 60 * 1000, // 15 min timeout
    }, (error, stdout, stderr) => {
      if (error) {
        console.error('[videoService] Download error:', stderr || error.message);
        return reject(new Error('Failed to download video'));
      }

      // Verify the merged file actually exists
      if (!fs.existsSync(outputPath)) {
        // Check if yt-dlp created a .webm or other format instead
        const altPaths = [
          outputPath.replace('.mp4', '.mkv'),
          outputPath.replace('.mp4', '.webm'),
        ];
        for (const alt of altPaths) {
          if (fs.existsSync(alt)) {
            console.log(`[videoService] Found alt format: ${path.basename(alt)}, renaming to .mp4`);
            fs.renameSync(alt, outputPath);
            break;
          }
        }
      }

      if (!fs.existsSync(outputPath)) {
        console.error('[videoService] Merged file not found after download');
        return reject(new Error('Video download completed but merged file not found. ffmpeg merge may have failed.'));
      }

      console.log(`[videoService] Download complete: ${videoId} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(1)} MB)`);
      resolve(outputPath);
    });
  });
}

/**
 * Clean up stale partial/unmerged files for a videoId
 */
function cleanStaleFiles(videoId) {
  try {
    const files = fs.readdirSync(VIDEOS_DIR);
    for (const file of files) {
      if (file.startsWith(videoId) && file !== `${videoId}.mp4`) {
        const fullPath = path.join(VIDEOS_DIR, file);
        fs.unlinkSync(fullPath);
        console.log(`[videoService] Cleaned stale file: ${file}`);
      }
    }
  } catch (e) {
    // Non-critical
  }
}

/**
 * Get ffmpeg binary path from ffmpeg-static npm package
 */
function getFFmpegPath() {
  try {
    const ffmpegPath = require('ffmpeg-static');
    if (ffmpegPath && fs.existsSync(ffmpegPath)) {
      return path.dirname(ffmpegPath); // yt-dlp wants the directory, not the binary
    }
  } catch (e) {
    // fallback
  }
  return 'ffmpeg'; // hope it's on PATH
}

/**
 * Get yt-dlp binary path
 * Uses system PATH (installed via pip install yt-dlp)
 */
function getYtdlpPath() {
  return 'yt-dlp';
}

module.exports = { getVideoMeta, downloadVideo };
