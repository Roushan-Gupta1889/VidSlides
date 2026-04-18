/**
 * Export Controller — Layer 1
 * Handles PDF and PPT generation from processed slides
 */

const { generatePdf, generatePpt } = require('../services/exportService');
const { createError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const FRAMES_DIR = path.join(__dirname, '..', 'tmp', 'frames');

/**
 * POST /api/export/pdf
 * Generate PDF from selected slides
 * 
 * Body: { videoId, title, slides: [{ image, timestamp }] }
 */
async function exportPdf(req, res, next) {
  try {
    const { videoId, title, slides } = req.body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      throw createError('No slides provided for export', 400);
    }

    // Resolve file paths for slides
    const resolvedSlides = resolveSlides(slides, videoId);
    
    const exportId = `${videoId}_${uuidv4().substring(0, 8)}`;
    const pdfPath = await generatePdf(resolvedSlides, title || 'VidSlides Export', exportId);

    // Stream the file to client
    const fileName = sanitizeFileName(`${title || 'VidSlides'}_slides.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);

    // Clean up export file after sending
    stream.on('end', () => {
      setTimeout(() => {
        try { fs.unlinkSync(pdfPath); } catch (e) { /* ignore */ }
      }, 5000);
    });

  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/export/ppt
 * Generate PowerPoint from selected slides
 * 
 * Body: { videoId, title, slides: [{ image, timestamp }] }
 */
async function exportPpt(req, res, next) {
  try {
    const { videoId, title, slides } = req.body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      throw createError('No slides provided for export', 400);
    }

    // Resolve file paths for slides
    const resolvedSlides = resolveSlides(slides, videoId);

    const exportId = `${videoId}_${uuidv4().substring(0, 8)}`;
    const pptPath = await generatePpt(resolvedSlides, title || 'VidSlides Export', exportId);

    // Stream the file to client
    const fileName = sanitizeFileName(`${title || 'VidSlides'}_slides.pptx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const stream = fs.createReadStream(pptPath);
    stream.pipe(res);

    stream.on('end', () => {
      setTimeout(() => {
        try { fs.unlinkSync(pptPath); } catch (e) { /* ignore */ }
      }, 5000);
    });

  } catch (err) {
    next(err);
  }
}

/**
 * Resolve slide image paths from relative URLs to absolute file paths
 */
function resolveSlides(slides, videoId) {
  return slides.map(slide => {
    // Convert /frames/videoId/0001.jpg → absolute path
    const imageName = path.basename(slide.image);
    const filePath = path.join(FRAMES_DIR, videoId, imageName);

    if (!fs.existsSync(filePath)) {
      console.warn(`[export] Missing slide image: ${filePath}`);
    }

    return {
      ...slide,
      filePath,
    };
  });
}

/**
 * Sanitize filename for Content-Disposition header
 */
function sanitizeFileName(name) {
  return name
    .replace(/[^a-zA-Z0-9\s._-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 200);
}

module.exports = { exportPdf, exportPpt };
