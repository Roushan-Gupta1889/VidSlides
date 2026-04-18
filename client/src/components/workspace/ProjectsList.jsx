/**
 * Workspace — Projects List
 */
import { motion } from 'framer-motion';
import useAppStore from '../../stores/appStore';
import { formatDuration } from '../../utils/youtube';

export default function ProjectsList() {
  const { projects, deleteProject, setActiveSection, setSlides, setVideoMeta, setProcessingState, getCachedResult } = useAppStore();

  const loadProject = (project) => {
    const cached = getCachedResult(project.videoId);
    if (cached) {
      setVideoMeta(cached.meta);
      setSlides(cached.slides);
      setProcessingState('success');
      setActiveSection('new-video');
    }
  };

  if (projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)', color: 'var(--text-tertiary)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>📂</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
          No Projects Yet
        </h2>
        <p style={{ fontSize: '0.9rem' }}>Process a video to see it saved here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
        📂 Projects
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {projects.map((project, i) => (
          <motion.div
            key={project.videoId}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', cursor: 'pointer' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => loadProject(project)}
          >
            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt={project.title}
                style={{
                  width: '100px', borderRadius: 'var(--radius-md)',
                  aspectRatio: '16/9', objectFit: 'cover',
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>
                {project.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {project.slidesCount} slides · {formatDuration(project.duration)}
              </p>
            </div>
            <div className="badge badge-success">
              ✅ Processed
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => { e.stopPropagation(); deleteProject(project.videoId); }}
              style={{ color: 'var(--text-tertiary)' }}
            >
              🗑
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
