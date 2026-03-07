import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - size / 2;
  const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - size / 2;
  const wave = document.createElement('span');
  wave.className = 'ripple-wave';
  wave.style.cssText = `width:${size}px;height:${size}px;left:${cx}px;top:${cy}px;`;
  btn.appendChild(wave);
  wave.addEventListener('animationend', () => wave.remove());
}

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

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuOpen && !hamburgerRef.current?.contains(e.target) && !menuRef.current?.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpen]);

  useEffect(() => {
    const btns = document.querySelectorAll('.ripple-btn');
    btns.forEach(btn => {
      btn.addEventListener('mousedown', addRipple);
      btn.addEventListener('touchstart', addRipple, { passive: true });
    });
    return () => btns.forEach(btn => {
      btn.removeEventListener('mousedown', addRipple);
      btn.removeEventListener('touchstart', addRipple);
    });
  }, [menuOpen]);

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);
  const handleThemeToggle = () => { setSpinning(true); toggle(); setTimeout(() => setSpinning(false), 400); };

  // ── Derived styles using inline style objects for Tailwind v4 safety ──────────
  const navBg     = isDark ? 'rgba(13,6,24,0.82)'   : 'rgba(255,255,255,0.88)';
  const navShadow = scrolled ? (isDark ? '0 4px 30px rgba(0,0,0,0.4)' : '0 4px 30px rgba(0,0,0,0.09)') : 'none';
  const navBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const logoColor  = isDark ? '#ffffff' : '#0f172a';
  const linkColor  = isDark ? '#d1d5db' : '#475569';
  const mobileMenuBg     = isDark ? 'rgba(13,6,24,0.95)' : 'rgba(255,255,255,0.97)';
  const mobileMenuBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const hamburgerColor   = isDark ? '#ffffff' : '#1e293b';

  const toggleBtnStyle = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    color: isDark ? '#fbbf24' : '#6d28d9',
  };
  const loginBtnStyle = {
    color: isDark ? '#ffffff' : '#374151',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.12)'}`,
  };

  const navLinks = [['#hero','Home'],['#features','Features'],['#footer','About']];

  return (
    <>
      <nav
        className="flex items-center justify-between px-5 md:px-16 py-3.5 border-b sticky top-0 z-50 backdrop-blur-md transition-all duration-300"
        style={{ background: navBg, boxShadow: navShadow, borderBottomColor: navBorder }}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V16h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-wide transition-colors" style={{ color: logoColor }}>AI Tutor</span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-10 text-sm">
          {navLinks.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="nav-link transition-colors duration-150"
                style={{ color: linkColor }}
                onMouseEnter={e => { e.currentTarget.style.color = isDark ? '#ffffff' : '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.color = linkColor; }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme toggle */}
          <button
            onClick={handleThemeToggle}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${spinning ? 'theme-spin' : ''}`}
            style={toggleBtnStyle}
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link
            to="/auth"
            className="ripple-btn hidden md:block px-5 py-2 text-sm rounded-full transition-all duration-150 cursor-pointer font-medium"
            style={loginBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Login
          </Link>
          <Link
            to="/auth"
            className="ripple-btn px-4 md:px-5 py-2 text-sm text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all duration-150 font-semibold shadow-lg shadow-purple-900/30 cursor-pointer"
          >
            Sign Up
          </Link>

          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            style={{ background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {[
              menuOpen ? { transform: 'translateY(7px) rotate(45deg)' } : {},
              menuOpen ? { opacity: 0 } : {},
              menuOpen ? { transform: 'translateY(-7px) rotate(-45deg)' } : {},
            ].map((style, i) => (
              <span
                key={i}
                className="w-5 h-0.5 rounded block transition-all duration-300 origin-center"
                style={{ background: hamburgerColor, ...style }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div
        ref={menuRef}
        className={`mobile-menu md:hidden border-b backdrop-blur-md sticky top-[65px] z-40${menuOpen ? ' open' : ''}`}
        style={{ background: mobileMenuBg, borderBottomColor: mobileMenuBorder }}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                onClick={closeMobileMenu}
                className="flex px-3 py-3 rounded-xl text-sm transition-all"
                style={{ color: linkColor }}
                onMouseEnter={e => { e.currentTarget.style.color = isDark ? '#ffffff' : '#0f172a'; e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = linkColor; e.currentTarget.style.background = 'transparent'; }}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="pt-2 pb-1">
            <Link
              to="/auth"
              className="block text-center w-full px-5 py-3 text-sm rounded-full transition-all cursor-pointer"
              style={loginBtnStyle}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
