/**
 * YouTube URL Parser
 * Extracts videoId from all YouTube URL formats
 */

const YOUTUBE_PATTERNS = [
  // Standard: youtube.com/watch?v=VIDEO_ID
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  // Short: youtu.be/VIDEO_ID
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  // Embed: youtube.com/embed/VIDEO_ID
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  // Shorts: youtube.com/shorts/VIDEO_ID
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  // Live: youtube.com/live/VIDEO_ID
  /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  // v= anywhere in query string
  /[?&]v=([a-zA-Z0-9_-]{11})/,
];

/**
 * Extract video ID from a YouTube URL
 * @param {string} url 
 * @returns {string|null} videoId or null if invalid
 */
function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Validate if a string is a valid YouTube URL
 * @param {string} url 
 * @returns {boolean}
 */
function isValidYouTubeUrl(url) {
  return extractVideoId(url) !== null;
}

/**
 * Build a canonical YouTube URL from a video ID
 * @param {string} videoId 
 * @returns {string}
 */
function buildUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

module.exports = { extractVideoId, isValidYouTubeUrl, buildUrl };
