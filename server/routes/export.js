/**
 * Export Routes — Layer 1
 */

const express = require('express');
const router = express.Router();
const { exportPdf, exportPpt } = require('../controllers/exportController');

// Generate and download PDF
router.post('/pdf', exportPdf);

// Generate and download PPT
router.post('/ppt', exportPpt);

module.exports = router;
