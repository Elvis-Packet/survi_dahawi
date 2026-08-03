import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { cn } from '@/utils/cn';

Chart.register(...registerables);

export default function LineChart({ data, options, className, height = 240 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.06)';
    const tickColor = isDark ? '#94a3b8' : '#64748b';

    const merged = {
      ...options,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, color: tickColor, font: { size: 11 } },
          ...options?.plugins?.legend,
        },
        tooltip: {
          backgroundColor: isDark ? '#152648' : '#0f172a',
          padding: 10,
          cornerRadius: 8,
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          ...options?.plugins?.tooltip,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: tickColor, font: { size: 11 } }, ...options?.scales?.x },
        y: {
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 11 } },
          beginAtZero: true,
          ...options?.scales?.y,
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, { type: 'line', data, options: merged });
    return () => chartRef.current?.destroy();
  }, [data, options]);

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
