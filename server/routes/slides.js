/**
 * Slides Routes — Layer 1
 */

const express = require('express');
const router = express.Router();
const { extract, preflight } = require('../controllers/slidesController');

// Pre-flight: instant metadata check (no download)
router.post('/preflight', preflight);

// Extract slides: full pipeline
router.post('/extract-slides', extract);

module.exports = router;
