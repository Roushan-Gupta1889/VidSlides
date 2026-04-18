/**
 * Slides Controller — Layer 1
 * Orchestrates: validate URL → pre-flight → download → extract → dedup → return
 */

const { extractVideoId, isValidYouTubeUrl, buildUrl } = require('../utils/urlParser');
const { getVideoMeta, downloadVideo } = require('../services/videoService');
const { extractFrames, removeDuplicates } = require('../services/frameService');
const { createError } = require('../middleware/errorHandler');
const path = require('path');
const fs = require('fs');

// Simple in-memory cache for Layer 1
const resultsCache = new Map();

/**
 * POST /api/extract-slides
 * Main slide extraction endpoint
 */
async function extract(req, res, next) {
  try {
    const { videoUrl } = req.body;

    // 1. Validate URL
    if (!videoUrl || !isValidYouTubeUrl(videoUrl)) {
      throw createError('Please enter a valid YouTube URL', 400);
    }

    const videoId = extractVideoId(videoUrl);
    const canonicalUrl = buildUrl(videoId);

    // 2. Check cache
    if (resultsCache.has(videoId)) {
      console.log(`[slides] Cache hit: ${videoId}`);
      return res.json({
        success: true,
        cached: true,
        message: 'Loaded instantly (already processed)',
        ...resultsCache.get(videoId),
      });
    }

    // 3. Pre-flight — get video metadata (no download)
    console.log(`[slides] Pre-flight: ${videoId}`);
    const meta = await getVideoMeta(canonicalUrl);

    // 4. Download video (720p max)
    console.log(`[slides] Downloading: ${meta.title} (${meta.duration}s)`);
    const videoPath = await downloadVideo(canonicalUrl, videoId);

    // 5. Extract frames via ffmpeg scene detection
    // (frameService: scene detect → gap-fill → interval fallback)
    console.log(`[slides] Extracting frames...`);
    const rawFrames = await extractFrames(videoPath, videoId, {
      videoDuration: meta.duration,
    });

    if (rawFrames.length === 0) {
      throw createError('Could not extract any slides from this video. The video may have very few scene changes.', 422);
    }

    // 6. Remove duplicates
    console.log(`[slides] Deduplicating ${rawFrames.length} frames...`);
    const slides = await removeDuplicates(rawFrames);

    // 7. Build result
    const result = {
      videoId,
      meta: {
        title: meta.title,
        duration: meta.duration,
        thumbnail: meta.thumbnail,
        uploader: meta.uploader,
      },
      slides: slides.map(({ image, timestamp, timestampSeconds }) => ({
        image,
        timestamp,
        timestampSeconds,
      })),
      totalSlides: slides.length,
      processedAt: new Date().toISOString(),
    };

    // 8. Cache result
    resultsCache.set(videoId, result);

    // 9. Clean up downloaded video (keep frames for export)
    try {
      const videoFile = path.join(__dirname, '..', 'tmp', 'videos', `${videoId}.mp4`);
      if (fs.existsSync(videoFile)) {
        fs.unlinkSync(videoFile);
        console.log(`[slides] Cleaned up video file: ${videoId}.mp4`);
      }
    } catch (e) {
      // Non-critical, ignore
    }

    console.log(`[slides] Success: ${slides.length} slides from "${meta.title}"`);

    res.json({
      success: true,
      cached: false,
      ...result,
    });

  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/preflight
 * Quick metadata check — no download, no processing
 */
async function preflight(req, res, next) {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl || !isValidYouTubeUrl(videoUrl)) {
      throw createError('Please enter a valid YouTube URL', 400);
    }

    const videoId = extractVideoId(videoUrl);
    const canonicalUrl = buildUrl(videoId);

    // Check if already cached
    const isCached = resultsCache.has(videoId);

    // Get metadata
    const meta = await getVideoMeta(canonicalUrl);

    // Determine tier
    const tier = getTier(meta.duration);

    res.json({
      success: true,
      videoId,
      cached: isCached,
      meta: {
        title: meta.title,
        duration: meta.duration,
        thumbnail: meta.thumbnail,
        uploader: meta.uploader,
      },
      tier,
    });

  } catch (err) {
    next(err);
  }
}

/**
 * Determine processing tier based on video duration
 */
function getTier(durationSeconds) {
  if (durationSeconds <= 1800) {
    return { level: 1, label: 'Short', chunks: 1, estimatedTime: '1-3 min' };
  }
  if (durationSeconds <= 7200) {
    const chunks = Math.ceil(durationSeconds / 1800);
    return { level: 2, label: 'Medium', chunks, estimatedTime: '5-15 min' };
  }
  if (durationSeconds <= 21600) {
    const chunks = Math.ceil(durationSeconds / 3600);
    return { level: 3, label: 'Long', chunks, estimatedTime: '10-30 min' };
  }
  const chunks = Math.ceil(durationSeconds / 3600);
  return { level: 4, label: 'Ultra Long', chunks, estimatedTime: '20-60 min' };
}

module.exports = { extract, preflight };
