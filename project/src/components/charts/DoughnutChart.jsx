import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { cn } from '@/utils/cn';

Chart.register(...registerables);

export default function DoughnutChart({ data, options, className, height = 240 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');
    const merged = {
      ...options,
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, color: isDark ? '#94a3b8' : '#64748b', font: { size: 11 }, ...options?.plugins?.legend?.labels },
          ...options?.plugins?.legend,
        },
        tooltip: {
          backgroundColor: isDark ? '#152648' : '#0f172a',
          padding: 10,
          cornerRadius: 8,
          ...options?.plugins?.tooltip,
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, { type: 'doughnut', data, options: merged });
    return () => chartRef.current?.destroy();
  }, [data, options]);

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
