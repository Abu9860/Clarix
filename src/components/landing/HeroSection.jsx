import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function typeWriter(el, text, speed, onDone) {
  let i = 0;
  el.textContent = '';
  (function tick() {
    el.textContent = text.slice(0, i);
    if (i++ <= text.length) setTimeout(tick, speed);
    else if (onDone) onDone();
  })();
}
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

export default function HeroSection() {
  const { isDark } = useTheme();
  const tw1Ref = useRef(null);
  const tw2Ref = useRef(null);
  const splineWrapRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const tw1 = tw1Ref.current;
      const tw2 = tw2Ref.current;
      if (!tw1 || !tw2) return;
      tw1.classList.add('tw-cursor');
      typeWriter(tw1, 'Memorize.', 62, () => {
        tw1.classList.remove('tw-cursor');
        tw2.classList.add('tw-cursor');
        setTimeout(() => { typeWriter(tw2, 'Actually Understand.', 62, () => tw2.classList.remove('tw-cursor')); }, 280);
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Counter animation for avatar bubble
  useEffect(() => {
    const el = document.getElementById('counter-bubble');
    if (!el) return;
    el.textContent = '+2k';
  }, []);


  useEffect(() => {
    const wrapper = splineWrapRef.current;
    if (!wrapper) return;
    const TILT_MAX = 8;
    const onMove = (e) => {
      const r = wrapper.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      wrapper.style.transform = `perspective(900px) rotateY(${dx * TILT_MAX}deg) rotateX(${-dy * TILT_MAX}deg)`;
    };
    const onLeave = () => {
      wrapper.style.transition = 'transform 0.5s ease';
      wrapper.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
      setTimeout(() => { wrapper.style.transition = ''; }, 500);
    };
    wrapper.addEventListener('mousemove', onMove);
    wrapper.addEventListener('mouseleave', onLeave);
    return () => { wrapper.removeEventListener('mousemove', onMove); wrapper.removeEventListener('mouseleave', onLeave); };
  }, []);

  useEffect(() => {
    const adjust = () => {
      const box = document.getElementById('spline-box');
      if (box) box.style.height = window.innerWidth >= 768 ? '480px' : '300px';
    };
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  // ── Derived styles (inline for Tailwind v4 safety) ──
  const headingColor   = isDark ? '#ffffff'  : '#0f172a';
  const descColor      = isDark ? '#9ca3af'  : '#4b5563';
  const trustColor     = isDark ? '#9ca3af'  : '#6b7280';
  const badgeBg        = isDark ? 'rgba(88,28,135,0.2)' : 'rgba(245,243,255,1)';
  const badgeBorder    = isDark ? 'rgba(168,85,247,0.3)' : 'rgba(167,139,250,0.4)';
  const avatarBorder   = isDark ? '#0d0618'  : '#f5f3ff';
  const splineCardBg   = isDark ? '#180c2e'  : '#f0ebff';
  const splineCardBorder = isDark ? 'rgba(88,28,135,0.25)' : 'rgba(167,139,250,0.35)';
  const splineCardShadow = isDark ? '0 25px 60px -15px rgba(59,7,100,0.6)' : '0 25px 60px -15px rgba(124,58,237,0.15)';
  const watermarkOverlay = isDark ? '#180c2e' : '#f0ebff';

  return (
    <section
      id="hero"
      className="flex flex-col md:flex-row items-center px-5 md:px-20 pt-8 pb-10 md:py-0 gap-6 md:gap-0 md:min-h-[calc(100vh-65px)]"
    >
      {/* LEFT: Text */}
      <div className="w-full md:w-[45%] flex flex-col gap-5 z-10 order-2 md:order-1">

        {/* Badge */}
        <div
          className="reveal reveal-delay-1 flex items-center gap-2 w-fit rounded-full px-4 py-1.5"
          style={{ border: `1px solid ${badgeBorder}`, background: badgeBg }}
        >
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse flex-shrink-0" />
          <span className="badge-shimmer text-xs tracking-widest uppercase font-semibold">AI-Powered Learning</span>
        </div>

        {/* Heading */}
        <h1 className="reveal reveal-delay-2 text-5xl md:text-6xl font-black leading-[1.1]" style={{ color: headingColor }}>
          Don't Just
          <span ref={tw1Ref} id="tw-word-1" className="text-purple-500 block min-h-[1.1em]" />
          <span ref={tw2Ref} id="tw-word-2" className="text-purple-500 block min-h-[1.1em]" />
        </h1>

        {/* Description */}
        <p className="reveal reveal-delay-3 text-[15px] md:text-base leading-relaxed max-w-sm" style={{ color: descColor }}>
          Your personal AI tutor covering Indian Education Board Curriculums,
          available 24/7 to guide you through complex topics with personalised
          learning paths and instant feedback.
        </p>

        {/* CTA Button */}
        <div className="reveal reveal-delay-4">
          <Link
            to="/auth"
            className="ripple-btn btn-glow inline-flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-95 text-sm cursor-pointer"
          >
            Get Started Free
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Avatar Trust Strip */}
        <div className="reveal reveal-delay-5 flex items-center gap-3 flex-wrap">
          <div className="flex -space-x-3">
            {[['A','bg-pink-500'],['B','bg-blue-500'],['C','bg-green-500']].map(([l, bg]) => (
              <div key={l} className={`w-9 h-9 rounded-full ${bg} border-2 flex items-center justify-center text-white text-xs font-bold flex-shrink-0`} style={{ borderColor: avatarBorder }}>{l}</div>
            ))}
            <div id="counter-bubble" className="w-9 h-9 rounded-full bg-purple-700 border-2 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 tabular" style={{ borderColor: avatarBorder }}>
              +2k
            </div>
          </div>
          <span className="text-sm" style={{ color: trustColor }}>Trusted by students country wide&nbsp;🇮🇳</span>
        </div>
      </div>

      {/* RIGHT: Spline 3D */}
      <div className="w-full md:w-[55%] flex items-center justify-center order-1 md:order-2">
        <div ref={splineWrapRef} className="w-full" style={{ maxWidth: '520px' }}>
          <div
            id="spline-box"
            className="reveal spline-box rounded-2xl overflow-hidden relative shadow-2xl"
            style={{
              background: splineCardBg,
              width: '100%',
              height: '300px',
              border: `1px solid ${splineCardBorder}`,
              boxShadow: splineCardShadow,
            }}
          >
            <spline-viewer
              url="https://prod.spline.design/ObgriS07CJWbBW8W/scene.splinecode"
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%' }}
            />
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '180px', height: '50px', background: watermarkOverlay, pointerEvents: 'none', zIndex: 10 }} />
          </div>
        </div>
      </div>
    </section>
  );
}
