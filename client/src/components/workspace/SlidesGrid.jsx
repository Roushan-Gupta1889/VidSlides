/**
 * Workspace — Slides Grid
 */
import { motion } from 'framer-motion';
import useAppStore from '../../stores/appStore';

export default function SlidesGrid() {
  const { slides, toggleSlideSelection } = useAppStore();

  return (
    <div className="slides-grid">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          className={`slide-card ${slide.selected ? 'selected' : ''}`}
          onClick={() => toggleSlideSelection(slide.id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img
            className="slide-card-image"
            src={slide.image}
            alt={`Slide at ${slide.timestamp}`}
            loading="lazy"
          />
          <div className="slide-card-checkbox">
            {slide.selected ? '✓' : ''}
          </div>
          <div className="slide-card-info">
            <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
              ⏱ {slide.timestamp}
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
              #{index + 1}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
