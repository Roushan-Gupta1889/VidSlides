/**
 * Workspace — Analytics Dashboard
 */
import { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import useAppStore from '../../stores/appStore';

Chart.register(...registerables);

export default function AnalyticsDashboard() {
  const { analytics } = useAppStore();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Prepare data from history
    const labels = analytics.history.slice(-10).map((h, i) => {
      const d = new Date(h.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const data = analytics.history.slice(-10).map(h => h.slides);

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['No data'],
        datasets: [{
          label: 'Slides Generated',
          data: data.length > 0 ? data : [0],
          backgroundColor: 'rgba(139, 92, 246, 0.3)',
          borderColor: '#8b5cf6',
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#94a3b8' },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#94a3b8' },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [analytics]);

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
        📊 Analytics
      </h2>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px' }} className="gradient-text">
            {analytics.videosProcessed}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Videos Processed
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px' }} className="gradient-text">
            {analytics.slidesGenerated}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Slides Generated
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px' }} className="gradient-text">
            {analytics.history.length}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Total Sessions
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{ padding: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-lg)', color: 'var(--text-secondary)' }}>
          Slides per Session
        </h3>
        <div style={{ height: '300px' }}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
}
