/**
 * VidSlides — Zustand State Store
 */
import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // ── Processing State ─────────────────────────
  processingState: 'idle', // idle | validating | preflight | processing | success | error
  currentJobId: null,
  videoMeta: null,
  slides: [],
  progress: { step: '', percent: 0, message: '' },
  error: null,

  // ── Free Usage Gate ──────────────────────────
  freeUsageDone: localStorage.getItem('vidslides_freeUsageDone') === 'true',
  isLoggedIn: localStorage.getItem('vidslides_isLoggedIn') === 'true',
  user: JSON.parse(localStorage.getItem('vidslides_user') || 'null'),
  showLoginModal: false,

  // ── Workspace ────────────────────────────────
  activeSection: 'new-video', // new-video | projects | exports | analytics
  sidebarOpen: false,

  // ── Projects ─────────────────────────────────
  projects: JSON.parse(localStorage.getItem('vidslides_projects') || '[]'),

  // ── Analytics ────────────────────────────────
  analytics: JSON.parse(localStorage.getItem('vidslides_analytics') || '{"videosProcessed":0,"slidesGenerated":0,"history":[]}'),

  // ── Cache ────────────────────────────────────
  cache: JSON.parse(localStorage.getItem('vidslides_cache') || '{}'),

  // ── Actions ──────────────────────────────────

  setProcessingState: (state) => set({ processingState: state }),
  setVideoMeta: (meta) => set({ videoMeta: meta }),
  setSlides: (slides) => set({ slides: slides.map((s, i) => ({ ...s, selected: true, id: i })) }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error, processingState: 'error' }),
  setActiveSection: (section) => set({ activeSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setShowLoginModal: (show) => set({ showLoginModal: show }),

  toggleSlideSelection: (id) => set((state) => ({
    slides: state.slides.map(s => s.id === id ? { ...s, selected: !s.selected } : s),
  })),

  selectAllSlides: () => set((state) => ({
    slides: state.slides.map(s => ({ ...s, selected: true })),
  })),

  deselectAllSlides: () => set((state) => ({
    slides: state.slides.map(s => ({ ...s, selected: false })),
  })),

  // Mark free usage as done
  markFreeUsageDone: () => {
    localStorage.setItem('vidslides_freeUsageDone', 'true');
    set({ freeUsageDone: true });
  },

  // Mock login
  login: (name = 'User') => {
    const user = { name, avatar: name.charAt(0).toUpperCase() };
    localStorage.setItem('vidslides_isLoggedIn', 'true');
    localStorage.setItem('vidslides_user', JSON.stringify(user));
    set({ isLoggedIn: true, user, showLoginModal: false });
  },

  logout: () => {
    localStorage.removeItem('vidslides_isLoggedIn');
    localStorage.removeItem('vidslides_user');
    set({ isLoggedIn: false, user: null });
  },

  // Cache results
  cacheResult: (videoId, data) => {
    const cache = get().cache;
    cache[videoId] = { ...data, cachedAt: Date.now() };
    localStorage.setItem('vidslides_cache', JSON.stringify(cache));
    set({ cache });
  },

  getCachedResult: (videoId) => {
    return get().cache[videoId] || null;
  },

  // Save as project
  saveProject: (project) => {
    const projects = [project, ...get().projects.filter(p => p.videoId !== project.videoId)];
    localStorage.setItem('vidslides_projects', JSON.stringify(projects));
    set({ projects });
  },

  deleteProject: (videoId) => {
    const projects = get().projects.filter(p => p.videoId !== videoId);
    localStorage.setItem('vidslides_projects', JSON.stringify(projects));
    set({ projects });
  },

  // Update analytics
  updateAnalytics: (slidesCount) => {
    const analytics = get().analytics;
    analytics.videosProcessed += 1;
    analytics.slidesGenerated += slidesCount;
    analytics.history.push({
      date: new Date().toISOString(),
      slides: slidesCount,
    });
    localStorage.setItem('vidslides_analytics', JSON.stringify(analytics));
    set({ analytics: { ...analytics } });
  },

  // Reset processing state
  resetProcessing: () => set({
    processingState: 'idle',
    videoMeta: null,
    slides: [],
    progress: { step: '', percent: 0, message: '' },
    error: null,
  }),
}));

export default useAppStore;
