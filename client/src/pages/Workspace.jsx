/**
 * Workspace Page
 */
import Sidebar from '../components/workspace/Sidebar';
import TopBar from '../components/workspace/TopBar';
import VideoInput from '../components/workspace/VideoInput';
import ProjectsList from '../components/workspace/ProjectsList';
import AnalyticsDashboard from '../components/workspace/AnalyticsDashboard';
import LoginModal from '../components/workspace/LoginModal';
import useAppStore from '../stores/appStore';

export default function Workspace() {
  const { activeSection } = useAppStore();

  const renderSection = () => {
    switch (activeSection) {
      case 'new-video':
        return <VideoInput />;
      case 'projects':
        return <ProjectsList />;
      case 'exports':
        return (
          <div style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-lg)' }}>📥</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
              Export History
            </h2>
            <p style={{ fontSize: '0.9rem' }}>Your PDF and PPT exports will appear here.</p>
          </div>
        );
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <VideoInput />;
    }
  };

  return (
    <div className="workspace">
      <Sidebar />
      <TopBar />
      <main className="workspace-main">
        {renderSection()}
      </main>
      <LoginModal />
    </div>
  );
}
