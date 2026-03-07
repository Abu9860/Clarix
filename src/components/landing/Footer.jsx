import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const textColor   = isDark ? '#9ca3af' : '#6b7280';

  return (
    <footer
      id="footer"
      className="px-5 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm"
      style={{ borderTop: `1px solid ${borderColor}`, color: textColor }}
    >
      <span>© 2025 Clarix. All rights reserved.</span>

      <div className="flex items-center gap-6">
        {['Privacy', 'Terms', 'Contact'].map(l => (
          <a
            key={l} href="#"
            className="transition-colors duration-150 hover:text-purple-500"
            style={{ color: textColor }}
          >
            {l}
          </a>
        ))}
      </div>
    </footer>
  );
}
