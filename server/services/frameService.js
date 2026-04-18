/**
 * Frame Service — Layer 1 Core (Fast)
 * 
 * Strategy by video length:
 *  - Short (<10 min): Scene detection at fps=2 + gap fill
 *  - Medium/Long (>10 min): Direct interval sampling (FAST — no full decode needed)
 * 
 * Both paths go through smart dedup to remove near-identical frames.
 */

const { execFile } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const FRAMES_DIR = path.join(__dirname, '..', 'tmp', 'frames');
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

const PARALLEL_BATCH = 8;

/**
 * Main extraction entry point
 */
async function extractFrames(videoPath, videoId, options = {}) {
  const {
    sceneThreshold = 0.15,
    startTime = 0,
    duration = null,
    chunkIndex = 0,
    videoDuration = 0,
  } = options;

  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`);
  }

  const outputDir = path.join(FRAMES_DIR, videoId);

  // Clean previous results
  if (fs.existsSync(outputDir)) {
    for (const f of fs.readdirSync(outputDir)) {
      try { fs.unlinkSync(path.join(outputDir, f)); } catch (e) {}
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const effectiveDuration = duration || videoDuration || 0;
  const t0 = Date.now();

  let slides;

  if (effectiveDuration <= 600) {
    // SHORT VIDEO (<10 min): Scene detection is fast enough
    console.log(`[frameService] Short video mode: scene detection + gap fill`);
    slides = await shortVideoExtraction(videoPath, outputDir, videoId, {
      sceneThreshold, startTime, duration, chunkIndex, effectiveDuration,
    });
  } else {
    // MEDIUM/LONG VIDEO (>10 min): Skip scene detection, use direct sampling
    // This is MUCH faster — just seeks to specific timestamps, no full decode
    console.log(`[frameService] Fast mode: direct interval sampling (${Math.ceil(effectiveDuration / 60)} min video)`);
    slides = await fastIntervalExtraction(videoPath, outputDir, videoId, {
      startTime, effectiveDuration, chunkIndex,
    });
  }

  if (slides.length === 0) {
    throw new Error('Failed to extract any frames from video');
  }

  console.log(`[frameService] Done: ${slides.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return slides;
}

/**
 * SHORT VIDEO PATH: scene detection + gap fill
 */
async function shortVideoExtraction(videoPath, outputDir, videoId, options) {
  const { sceneThreshold, startTime, duration, chunkIndex, effectiveDuration } = options;

  // Scene detection with fps=2
  let slides = await runSceneDetection(videoPath, outputDir, videoId, {
    sceneThreshold, startTime, duration, chunkIndex,
  });

  console.log(`[frameService] Scene detection: ${slides.length} frames`);

  // Gap fill if needed
  const expectedMin = Math.max(5, Math.floor((effectiveDuration / 60) * 1.5));
  if (slides.length < expectedMin && effectiveDuration > 60) {
    console.log(`[frameService] Gap-filling (have ${slides.length}, want ~${expectedMin})`);
    const gapSlides = await fillGaps(videoPath, outputDir, videoId, slides, {
      startTime, effectiveDuration, chunkIndex,
    });
    slides = [...slides, ...gapSlides].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
  }

  // Fallback
  if (slides.length === 0) {
    slides = await fastIntervalExtraction(videoPath, outputDir, videoId, {
      startTime, effectiveDuration, chunkIndex,
    });
  }

  return slides;
}

/**
 * FAST INTERVAL EXTRACTION: Direct keyframe seeking
 * For a 38-min video: samples every 15s = ~152 frames
 * Each extraction takes <1s (keyframe seek), and we run 8 in parallel
 * Total: ~20 seconds instead of 5+ minutes
 */
async function fastIntervalExtraction(videoPath, outputDir, videoId, options) {
  const { startTime = 0, effectiveDuration, chunkIndex = 0 } = options;

  // Calculate interval: aim for ~2-3 slides per minute
  const interval = effectiveDuration > 3600 ? 30 : 15; // 15s for <1hr, 30s for >1hr
  const prefix = chunkIndex > 0 ? `chunk${chunkIndex}_` : 'f_';

  // Build timestamp list
  const timestamps = [];
  for (let t = startTime + 5; t < startTime + effectiveDuration - 5; t += interval) {
    timestamps.push(t);
  }

  console.log(`[frameService] Extracting ${timestamps.length} frames (every ${interval}s, ${PARALLEL_BATCH} parallel)`);

  const slides = [];

  // Process in parallel batches
  for (let i = 0; i < timestamps.length; i += PARALLEL_BATCH) {
    const batch = timestamps.slice(i, i + PARALLEL_BATCH);
    const batchNum = Math.floor(i / PARALLEL_BATCH) + 1;
    const totalBatches = Math.ceil(timestamps.length / PARALLEL_BATCH);

    if (batchNum % 5 === 1 || batchNum === totalBatches) {
      console.log(`[frameService] Batch ${batchNum}/${totalBatches}...`);
    }

    const results = await Promise.allSettled(
      batch.map((t, bi) => {
        const idx = i + bi;
        const filename = `${prefix}${String(idx + 1).padStart(4, '0')}.jpg`;
        const outputFile = path.join(outputDir, filename);

        return extractSingleFrame(videoPath, outputFile, t).then(() => ({
          image: `/frames/${videoId}/${filename}`,
          timestamp: formatTimestamp(t),
          timestampSeconds: t,
          filePath: outputFile,
        }));
      })
    );

    for (const r of results) {
      if (r.status === 'fulfilled') slides.push(r.value);
    }
  }

  console.log(`[frameService] Extracted ${slides.length}/${timestamps.length} frames`);
  return slides;
}

/**
 * Scene detection (short videos only)
 */
async function runSceneDetection(videoPath, outputDir, videoId, options) {
  const { sceneThreshold, startTime, duration, chunkIndex } = options;
  const prefix = chunkIndex > 0 ? `chunk${chunkIndex}_` : 'sc_';
  const outputPattern = path.join(outputDir, `${prefix}%04d.jpg`);

  const args = [];
  if (startTime > 0) args.push('-ss', String(startTime));
  args.push('-i', videoPath);
  if (duration) args.push('-t', String(duration));
  args.push(
    '-vf', `fps=2,select='gt(scene\\,${sceneThreshold})',showinfo`,
    '-vsync', 'vfr', '-q:v', '2', '-y', outputPattern
  );

  return new Promise((resolve) => {
    const timestamps = [];
    execFile(ffmpegPath, args, {
      maxBuffer: 100 * 1024 * 1024,
      timeout: 5 * 60 * 1000,
    }, (error, stdout, stderr) => {
      if (stderr) {
        for (const line of stderr.split('\n')) {
          const match = line.match(/pts_time:([\d.]+)/);
          if (match) timestamps.push(parseFloat(match[1]) + startTime);
        }
      }
      const files = fs.readdirSync(outputDir)
        .filter(f => f.startsWith(prefix) && f.endsWith('.jpg')).sort();
      resolve(files.map((file, i) => ({
        image: `/frames/${videoId}/${file}`,
        timestamp: formatTimestamp(timestamps[i] || (startTime + i * 30)),
        timestampSeconds: timestamps[i] || (startTime + i * 30),
        filePath: path.join(outputDir, file),
      })));
    });
  });
}

/**
 * Fill gaps > 45s between scene-detected frames
 */
async function fillGaps(videoPath, outputDir, videoId, existingSlides, options) {
  const { startTime, effectiveDuration, chunkIndex } = options;
  const GAP = 45, INTERVAL = 20;
  const sampleTimes = [];

  const firstT = existingSlides[0]?.timestampSeconds ?? effectiveDuration;
  if (firstT > GAP) {
    for (let t = startTime + 10; t < firstT - 5; t += INTERVAL) sampleTimes.push(t);
  }

  for (let i = 0; i < existingSlides.length - 1; i++) {
    const gap = existingSlides[i + 1].timestampSeconds - existingSlides[i].timestampSeconds;
    if (gap > GAP) {
      for (let t = existingSlides[i].timestampSeconds + 10; t < existingSlides[i + 1].timestampSeconds - 5; t += INTERVAL) {
        sampleTimes.push(t);
      }
    }
  }

  const lastT = existingSlides[existingSlides.length - 1]?.timestampSeconds ?? startTime;
  if (startTime + effectiveDuration - lastT > GAP) {
    for (let t = lastT + INTERVAL; t < startTime + effectiveDuration - 5; t += INTERVAL) sampleTimes.push(t);
  }

  if (sampleTimes.length === 0) return [];

  console.log(`[frameService] Gap-filling: ${sampleTimes.length} frames`);
  const prefix = chunkIndex > 0 ? `chunk${chunkIndex}_gap_` : 'gap_';
  const gapSlides = [];

  for (let i = 0; i < sampleTimes.length; i += PARALLEL_BATCH) {
    const batch = sampleTimes.slice(i, i + PARALLEL_BATCH);
    const results = await Promise.allSettled(
      batch.map((t, bi) => {
        const idx = i + bi;
        const fn = `${prefix}${String(idx + 1).padStart(4, '0')}.jpg`;
        const out = path.join(outputDir, fn);
        return extractSingleFrame(videoPath, out, t).then(() => ({
          image: `/frames/${videoId}/${fn}`,
          timestamp: formatTimestamp(t),
          timestampSeconds: t,
          filePath: out,
          isGapFill: true,
        }));
      })
    );
    for (const r of results) if (r.status === 'fulfilled') gapSlides.push(r.value);
  }
  return gapSlides;
}

/**
 * Extract single frame — uses input seeking (-ss before -i) for instant seek
 */
function extractSingleFrame(videoPath, outputFile, seconds) {
  return new Promise((resolve, reject) => {
    execFile(ffmpegPath, [
      '-ss', String(seconds),
      '-i', videoPath,
      '-vframes', '1',
      '-q:v', '2',
      '-y',
      outputFile,
    ], { maxBuffer: 5 * 1024 * 1024, timeout: 10000 }, (error) => {
      if (error || !fs.existsSync(outputFile)) return reject(new Error('Failed'));
      resolve();
    });
  });
}

/**
 * Dedup: scene frames at 0.92, gap-fill frames at 0.98
 */
async function removeDuplicates(slides, threshold = 0.92) {
  if (slides.length <= 1) return slides;

  const GAP_THRESH = 0.98;
  console.log(`[frameService] Deduplicating ${slides.length} frames`);

  const kept = [slides[0]];
  for (let i = 1; i < slides.length; i++) {
    const sim = await compareFrames(kept[kept.length - 1].filePath, slides[i].filePath);
    const thresh = slides[i].isGapFill ? GAP_THRESH : threshold;
    if (sim < thresh) {
      kept.push(slides[i]);
    } else {
      try { fs.unlinkSync(slides[i].filePath); } catch (e) {}
    }
  }

  console.log(`[frameService] Dedup: ${slides.length} → ${kept.length}`);
  return kept;
}

async function compareFrames(a, b) {
  try {
    const sz = 16;
    const [bA, bB] = await Promise.all([
      sharp(a).resize(sz, sz, { fit: 'fill' }).grayscale().raw().toBuffer(),
      sharp(b).resize(sz, sz, { fit: 'fill' }).grayscale().raw().toBuffer(),
    ]);
    if (bA.length !== bB.length) return 0;
    let d = 0;
    for (let i = 0; i < bA.length; i++) d += Math.abs(bA[i] - bB[i]);
    return 1 - (d / (255 * bA.length));
  } catch { return 0; }
}

function formatTimestamp(s) {
  s = Math.floor(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    : `${m}:${sec.toString().padStart(2, '0')}`;
}

module.exports = { extractFrames, removeDuplicates, formatTimestamp };
