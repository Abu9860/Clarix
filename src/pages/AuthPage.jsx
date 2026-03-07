import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// ── Inline SVG Icons ───────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ── Animated Floating Label Input ───────────────────────────────────────────────
function FloatingInput({ label, type = 'text', id, isDark, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const isFloating = focused || !!value;

  return (
    <div className="relative">
      <input
        id={id}
        type={isPassword ? (showPass ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-5 pb-2.5 px-4 rounded-xl outline-none text-sm transition-all duration-300"
        autoComplete="off"
        style={{
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          border: `1.5px solid ${focused ? (isDark ? '#a855f7' : '#7c3aed') : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          color: isDark ? '#f3f4f6' : '#111827',
          boxShadow: focused ? `0 0 0 3px ${isDark ? 'rgba(168,85,247,0.12)' : 'rgba(124,58,237,0.1)'}` : 'none',
        }}
      />
      <label
        htmlFor={id}
        className="absolute left-4 pointer-events-none transition-all duration-200 font-medium select-none"
        style={{
          top: isFloating ? '7px' : '50%',
          transform: isFloating ? 'none' : 'translateY(-50%)',
          fontSize: isFloating ? '10px' : '13px',
          letterSpacing: isFloating ? '0.07em' : '0',
          textTransform: isFloating ? 'uppercase' : 'none',
          color: focused ? (isDark ? '#c084fc' : '#7c3aed') : isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.35)',
        }}
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPass(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity"
          style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}
        >
          {showPass ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
}

// ── Animated Visual Panel (interactive while no 3D model) ──────────────────────
function VisualPanel({ isDark }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    // Guard: canvas is hidden on mobile (offsetWidth = 0) — skip drawing entirely
    if (W === 0 || H === 0) return;

    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener('mousemove', onMouse);

    // Generate nodes (neural network style)
    const nodes = Array.from({ length: 28 }, (_, i) => ({
      x: (Math.random() * 0.8 + 0.1) * W,
      y: (Math.random() * 0.8 + 0.1) * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 2,
      alpha: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.012;
      const mx = mouseRef.current.x * W;
      const my = mouseRef.current.y * H;

      ctx.clearRect(0, 0, W, H);

      // Draw connections
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw nodes with pulse + mouse attraction
      nodes.forEach(n => {
        n.pulse += 0.03;
        const pulseFactor = 1 + Math.sin(n.pulse) * 0.25;
        const r = n.r * pulseFactor;

        // Mouse attraction
        const dx = mx - n.x;
        const dy = my - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          n.vx += (dx / d) * 0.06;
          n.vy += (dy / d) * 0.06;
        }

        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.97;
        n.vy *= 0.97;
        if (n.x < 10 || n.x > W - 10) n.vx *= -1;
        if (n.y < 10 || n.y > H - 10) n.vy *= -1;

        // Glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        grd.addColorStop(0, `rgba(168,85,247,${n.alpha})`);
        grd.addColorStop(1, 'rgba(168,85,247,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,130,255,${n.alpha + 0.2})`;
        ctx.fill();
      });

      // Rotating ring
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(t * 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(W, H) * 0.28, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168,85,247,0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 14]);
      ctx.stroke();
      ctx.rotate(t * -0.5);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(W, H) * 0.21, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99,102,241,0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 20]);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div
      className="relative hidden md:flex flex-col items-center justify-between overflow-hidden flex-shrink-0 py-8 px-8"
      style={{
        width: '46%',
        background: isDark
          ? 'linear-gradient(145deg, #2e0b52 0%, #1a1040 50%, #0c071a 100%)'
          : 'linear-gradient(145deg, #7c3aed 0%, #4f46e5 55%, #3730a3 100%)',
      }}
    >
      {/* Interactive canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2 self-start">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l11 6 9-4.91V16h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
          </svg>
        </div>
        <span className="text-white font-bold">AI Tutor</span>
      </div>

      {/* Center: placeholder box */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center mb-2"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <p className="text-white font-black text-2xl leading-tight">Learn Smarter<br/>with AI</p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', maxWidth: '200px' }}>
          Move your mouse to interact with the neural network above
        </p>
      </div>

      {/* Bottom: features list */}
      <div className="relative z-10 flex flex-col gap-2.5 self-start w-full">
        {['Personalised Paths','24/7 Availability','Instant Feedback'].map(f => (
          <div key={f} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main AuthPage ──────────────────────────────────────────────────────────────
export default function AuthPage() {
  const { isDark, toggle } = useTheme();
  const [mode, setMode] = useState('login');
  const [animating, setAnimating] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });

  const switchMode = (target) => {
    if (target === mode || animating) return;
    setAnimating(true);
    setTimeout(() => { setMode(target); setTimeout(() => setAnimating(false), 400); }, 200);
  };

  const pageBg = isDark
    ? 'radial-gradient(ellipse at 20% 50%, #1a0533 0%, #0d0618 60%, #030009 100%)'
    : 'radial-gradient(ellipse at 20% 50%, #f3e8ff 0%, #ede9fe 55%, #ddd6fe 100%)';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden transition-colors duration-500"
      style={{ background: pageBg }}
    >
      {/* Glow orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', top: '-150px', left: '-150px', animation: 'float1 18s ease-in-out infinite alternate' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', bottom: '-100px', right: '-100px', animation: 'float2 22s ease-in-out infinite alternate' }} />

      {/* Back + Theme toggle */}
      <Link to="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-all px-3 py-2 rounded-lg"
        style={{
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Home
      </Link>

      <button
        onClick={toggle}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-xl transition-all duration-300"
        style={{
          background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.09)'}`,
          color: isDark ? '#fbbf24' : '#6d28d9',
          boxShadow: isDark ? '0 0 20px rgba(251,191,36,0.12)' : '0 0 20px rgba(109,40,217,0.08)',
        }}
        aria-label="Toggle theme"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* ── Main Card ── */}
      <div
        className="relative w-full flex overflow-hidden"
        style={{
          maxWidth: '940px',
          minHeight: '580px',
          borderRadius: '28px',
          background: isDark ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.8)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
          backdropFilter: 'blur(28px)',
          boxShadow: isDark
            ? '0 40px 100px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)'
            : '0 40px 100px -20px rgba(109,40,217,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {/* Left visual panel */}
        <VisualPanel isDark={isDark} />

        {/* Right form panel */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-10">

          {/* Segmented Toggle */}
          <div
            className="flex self-start mb-8 p-1 rounded-xl gap-1"
            style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
            }}
          >
            {['login','signup'].map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 capitalize"
                style={{
                  background: mode === m
                    ? isDark ? 'rgba(168,85,247,0.22)' : '#7c3aed'
                    : 'transparent',
                  color: mode === m
                    ? isDark ? '#e9d5ff' : '#fff'
                    : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.38)',
                  boxShadow: mode === m
                    ? isDark ? '0 0 18px rgba(168,85,247,0.2)' : '0 4px 14px rgba(124,58,237,0.32)'
                    : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form content with animate in/out */}
          <div
            className="transition-all duration-300"
            style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(8px)' : 'translateY(0)' }}
          >
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-3xl font-black mb-1.5" style={{ color: isDark ? '#fff' : '#0f172a' }}>
                {mode === 'login' ? 'Welcome back 👋' : 'Create account ✨'}
              </h1>
              <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.4)' }}>
                {mode === 'login' ? 'Sign in to continue your learning journey' : 'Join thousands of students learning with AI'}
              </p>
            </div>

            {/* Google button */}
            <button
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl mb-5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'}`,
                color: isDark ? '#e5e7eb' : '#374151',
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' }} />
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.28)' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' }} />
            </div>

            {/* Fields */}
            <form onSubmit={e => e.preventDefault()} className="space-y-3">
              {mode === 'signup' && (
                <FloatingInput label="Full Name" id="su-name" isDark={isDark} value={signupForm.name} onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))} />
              )}
              <FloatingInput
                label="Email Address" type="email"
                id={`${mode}-email`} isDark={isDark}
                value={mode === 'login' ? loginForm.email : signupForm.email}
                onChange={e => mode === 'login' ? setLoginForm(f => ({ ...f, email: e.target.value })) : setSignupForm(f => ({ ...f, email: e.target.value }))}
              />
              <FloatingInput
                label="Password" type="password"
                id={`${mode}-pw`} isDark={isDark}
                value={mode === 'login' ? loginForm.password : signupForm.password}
                onChange={e => mode === 'login' ? setLoginForm(f => ({ ...f, password: e.target.value })) : setSignupForm(f => ({ ...f, password: e.target.value }))}
              />

              {mode === 'login' && (
                <div className="flex justify-between items-center pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-purple-500" />
                    <span style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.42)' }}>Remember me</span>
                  </label>
                  <a href="#" className="hover:underline" style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#a78bfa' : '#7c3aed' }}>Forgot password?</a>
                </div>
              )}

              {mode === 'signup' && (
                <p style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.32)', lineHeight: '1.5' }}>
                  By signing up you agree to our{' '}
                  <a href="#" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} className="hover:underline">Terms</a>
                  {' & '}
                  <a href="#" style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} className="hover:underline">Privacy Policy</a>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-1"
                style={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)',
                  boxShadow: '0 8px 28px rgba(147,51,234,0.32)',
                }}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.38)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')} className="hover:underline font-bold" style={{ color: isDark ? '#c084fc' : '#7c3aed' }}>
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,80px) scale(1.1); } }
        @keyframes float2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-50px,-60px) scale(1.08); } }
      `}</style>
    </div>
  );
}
