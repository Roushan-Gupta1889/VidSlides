/**
 * Workspace — Export Bar (Fixed bottom)
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../../stores/appStore';
import { exportPdf, exportPpt } from '../../services/api';

export default function ExportBar() {
  const { slides, videoMeta } = useAppStore();
  const [exporting, setExporting] = useState(null); // 'pdf' | 'ppt' | null

  const selectedSlides = slides.filter(s => s.selected);
  const videoId = useAppStore.getState().cache
    ? Object.keys(useAppStore.getState().cache).find(id =>
        useAppStore.getState().cache[id]?.meta?.title === videoMeta?.title
      )
    : null;

  const handleExport = async (type) => {
    if (selectedSlides.length === 0) return;
    setExporting(type);

    try {
      const exportSlides = selectedSlides.map(s => ({
        image: s.image,
        timestamp: s.timestamp,
      }));

      if (type === 'pdf') {
        await exportPdf(videoId || 'export', videoMeta?.title || 'VidSlides', exportSlides);
      } else {
        await exportPpt(videoId || 'export', videoMeta?.title || 'VidSlides', exportSlides);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(null);
    }
  };

  if (selectedSlides.length === 0) return null;

  return (
    <motion.div
      className="export-bar"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
        {selectedSlides.length} of {slides.length} selected
      </span>

      <button
        className="btn btn-primary"
        onClick={() => handleExport('pdf')}
        disabled={exporting !== null}
      >
        {exporting === 'pdf' ? '⏳ Generating...' : '📄 Download PDF'}
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => handleExport('ppt')}
        disabled={exporting !== null}
      >
        {exporting === 'ppt' ? '⏳ Generating...' : '📊 Download PPT'}
      </button>
    </motion.div>
  );
}
