/**
 * YouTube URL utilities
 */

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  /[?&]v=([a-zA-Z0-9_-]{11})/,
];

export function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.trim().match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function isValidYouTubeUrl(url) {
  return extractVideoId(url) !== null;
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function getTierLabel(duration) {
  if (duration <= 1800) return { level: 1, label: 'Short', color: '#22c55e' };
  if (duration <= 7200) return { level: 2, label: 'Medium', color: '#f59e0b' };
  if (duration <= 21600) return { level: 3, label: 'Long', color: '#ef4444' };
  return { level: 4, label: 'Ultra Long', color: '#f43f5e' };
}
