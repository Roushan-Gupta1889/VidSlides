/**
 * API Service — Axios client for backend
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 600000, // 10 min timeout for video processing
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Pre-flight: Get video metadata instantly (no download)
 */
export async function preflightVideo(videoUrl) {
  const { data } = await api.post('/preflight', { videoUrl });
  return data;
}

/**
 * Extract slides from a YouTube video
 */
export async function extractSlides(videoUrl) {
  const { data } = await api.post('/extract-slides', { videoUrl });
  return data;
}

/**
 * Download slides as PDF
 */
export async function exportPdf(videoId, title, slides) {
  const response = await api.post('/export/pdf', { videoId, title, slides }, {
    responseType: 'blob',
  });
  
  // Trigger browser download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitize(title)}_slides.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Download slides as PPT
 */
export async function exportPpt(videoId, title, slides) {
  const response = await api.post('/export/ppt', { videoId, title, slides }, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${sanitize(title)}_slides.pptx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function sanitize(name) {
  return (name || 'VidSlides').replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_').substring(0, 60);
}

export default api;
