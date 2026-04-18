/**
 * Workspace — Video Input + Processing + Results Orchestrator
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../stores/appStore';
import { isValidYouTubeUrl, extractVideoId, formatDuration, getTierLabel } from '../../utils/youtube';
import { preflightVideo, extractSlides } from '../../services/api';
import SlidesGrid from './SlidesGrid';
import ExportBar from './ExportBar';

export default function VideoInput() {
  const [url, setUrl] = useState('');
  const {
    processingState, setProcessingState, videoMeta, setVideoMeta,
    slides, setSlides, progress, setProgress, error, setError,
    freeUsageDone, isLoggedIn, setShowLoginModal, markFreeUsageDone,
    getCachedResult, cacheResult, saveProject, updateAnalytics, resetProcessing,
  } = useAppStore();

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Validate
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    // Free usage gate
    if (freeUsageDone && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const videoId = extractVideoId(url);

    // Check cache
    const cached = getCachedResult(videoId);
    if (cached) {
      setVideoMeta(cached.meta);
      setSlides(cached.slides);
      setProcessingState('success');
      return;
    }

    try {
      // Pre-flight
      setProcessingState('preflight');
      setError(null);
      setProgress({ step: 'Checking video...', percent: 10, message: '' });

      const preflight = await preflightVideo(url);
      setVideoMeta(preflight.meta);
      const tier = getTierLabel(preflight.meta.duration);

      // Processing
      setProcessingState('processing');
      setProgress({ step: 'Downloading video...', percent: 25, message: `${tier.label} video · ${formatDuration(preflight.meta.duration)}` });

      // Simulate step updates (real SSE will replace this in Layer 5)
      const progressSteps = [
        { step: 'Downloading video...', percent: 30 },
        { step: 'Extracting key frames...', percent: 50 },
        { step: 'Removing duplicates...', percent: 75 },
        { step: 'Preparing slides...', percent: 90 },
      ];

      let stepIndex = 0;
      const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          setProgress({ ...progressSteps[stepIndex], message: '' });
          stepIndex++;
        }
      }, 3000);

      const result = await extractSlides(url);
      clearInterval(progressInterval);

      if (result.success) {
        setSlides(result.slides);
        setVideoMeta(result.meta);
        setProcessingState('success');
        setProgress({ step: 'Complete!', percent: 100, message: '' });

        // Cache result
        cacheResult(result.videoId, { meta: result.meta, slides: result.slides });

        // Save as project
        saveProject({
          videoId: result.videoId,
          title: result.meta.title,
          thumbnail: result.meta.thumbnail,
          duration: result.meta.duration,
          slidesCount: result.slides.length,
          processedAt: result.processedAt,
        });

        // Update analytics
        updateAnalytics(result.slides.length);

        // Mark free usage
        if (!freeUsageDone) {
          markFreeUsageDone();
        }
      }
    } catch (err) {
      setProcessingState('error');
      setError(err.response?.data?.error?.message || err.message || 'Failed to process video');
    }
  };

  const isProcessing = processingState === 'preflight' || processingState === 'processing';

  return (
    <div>
      {/* URL Input */}
      <AnimatePresence mode="wait">
        {(processingState === 'idle' || processingState === 'error') && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '700px', margin: '0 auto', paddingTop: 'var(--space-3xl)' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
                🎬 New Video
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Paste a YouTube URL to extract slides
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <input
                  id="video-url-input"
                  className="input input-lg"
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!url.trim()}
              >
                Generate Slides
              </button>
            </form>

            {/* Error message */}
            {processingState === 'error' && error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--error)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span>❌ {error}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => { resetProcessing(); }}>
                    Try Another
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={handleSubmit}>
                    Retry
                  </button>
                </div>
              </motion.div>
            )}

            {!freeUsageDone && (
              <p style={{
                textAlign: 'center', marginTop: 'var(--space-lg)',
                color: 'var(--text-tertiary)', fontSize: '0.85rem',
              }}>
                ⚡ First video is free — no login required
              </p>
            )}
          </motion.div>
        )}

        {/* Processing View */}
        {isProcessing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '600px', margin: '0 auto', paddingTop: 'var(--space-3xl)' }}
          >
            {/* Video Meta Card */}
            {videoMeta && (
              <div className="card" style={{
                display: 'flex', gap: 'var(--space-lg)', alignItems: 'center',
                marginBottom: 'var(--space-2xl)',
              }}>
                {videoMeta.thumbnail && (
                  <img
                    src={videoMeta.thumbnail}
                    alt={videoMeta.title}
                    style={{
                      width: '120px', borderRadius: 'var(--radius-md)',
                      aspectRatio: '16/9', objectFit: 'cover',
                    }}
                  />
                )}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>
                    {videoMeta.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {videoMeta.uploader} · {formatDuration(videoMeta.duration)}
                  </p>
                  <div className="badge badge-accent" style={{ marginTop: '8px' }}>
                    {getTierLabel(videoMeta.duration).label} Video
                  </div>
                </div>
              </div>
            )}

            {/* Processing Steps */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
                🔄 Processing...
              </h2>

              {['Checking video...', 'Downloading video...', 'Extracting key frames...', 'Removing duplicates...', 'Preparing slides...'].map((step, i) => {
                const stepPercents = [10, 30, 50, 75, 90];
                const isActive = progress.percent >= stepPercents[i] && progress.percent < (stepPercents[i + 1] || 101);
                const isDone = progress.percent > (stepPercents[i + 1] || 100);

                return (
                  <div key={i} className="processing-step">
                    <div className={`processing-step-icon ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                      {isDone ? '✅' : isActive ? '🔄' : '⏳'}
                    </div>
                    <span style={{
                      color: isDone ? 'var(--success)' : isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      fontSize: '0.9rem',
                    }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: '0%' }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p style={{ textAlign: 'center', marginTop: 'var(--space-sm)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              {progress.step} {progress.percent}%
            </p>
          </motion.div>
        )}

        {/* Success — Slides Grid */}
        {processingState === 'success' && slides.length > 0 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)',
            }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>
                  ✅ {slides.length} Slides Extracted
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {videoMeta?.title}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => {
                  const allSelected = slides.every(s => s.selected);
                  allSelected ? useAppStore.getState().deselectAllSlides() : useAppStore.getState().selectAllSlides();
                }}>
                  {slides.every(s => s.selected) ? 'Deselect All' : 'Select All'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => { resetProcessing(); setUrl(''); }}>
                  New Video
                </button>
              </div>
            </div>

            <SlidesGrid />
            <ExportBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
