import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function animateCounter(el, target, duration, format) {
  const start = performance.now();
  (function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = format(Math.round(easeOutCubic(progress) * target));
    if (progress < 1) requestAnimationFrame(frame);
  })(performance.now());
}

const statsData = [
  { id: 'stat1', target: 20000, format: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k+' : v + '+' },
  { id: 'stat2', target: 40,    format: v => v + '+' },
  { id: 'stat3', target: 98,    format: v => v + '%' },
  { id: 'stat4', target: 5000,  format: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k+' : v + '+' },
];
const statLabels = ['Students', 'Subjects', 'Satisfaction', 'Daily Sessions'];

export default function StatsSection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);

  useEffect(() => {
    let counted = false;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statsData.forEach(({ id, target, format }) => {
          const el = document.getElementById(id);
          if (el) animateCounter(el, target, 1500, format);
        });
      }
    }, { threshold: 0.3 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const cardBg     = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(167,139,250,0.4)';
  const labelColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <section id="stats" ref={sectionRef} className="px-5 md:px-20 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map(({ id }, i) => (
          <div
            key={id}
            className={`stat-card reveal reveal-delay-${i + 1} rounded-2xl p-5 text-center backdrop-blur-sm`}
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <p id={id} className="text-3xl font-black text-purple-500 tabular">0</p>
            <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: labelColor }}>{statLabels[i]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
