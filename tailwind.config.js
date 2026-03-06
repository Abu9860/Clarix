/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        light: {
          bg:      "#F7F7F5",
          surface: "#FFFFFF",
          panel1:  "#F7F7F5",
          panel2:  "#FFFFFF",
          panel3:  "#F9F8FC",
          border:  "#E8E5F0",
          muted:   "#9CA3AF",
          text:    "#1F1235",
          subtext: "#6B7280",
        },
        dark: {
          bg:      "#1A1625",
          surface: "#1E1A2D",
          panel1:  "#1C1829",
          panel2:  "#211D2E",
          panel3:  "#1E1B2C",
          border:  "#2E2840",
          muted:   "#6B6880",
          text:    "#F0EEF8",
          subtext: "#C4C0D4",
        },
      },
      fontFamily: {
        sans:    ["'DM Sans'", "sans-serif"],
        display: ["'Sora'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "xl":  "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        "panel-light": "0 1px 3px rgba(124, 58, 237, 0.06)",
        "panel-dark":  "0 1px 3px rgba(0, 0, 0, 0.3)",
        "glow-sm":     "0 0 12px rgba(139, 92, 246, 0.2)",
        "glow-md":     "0 0 24px rgba(139, 92, 246, 0.3)",
      },
      transitionDuration: {
        "250": "250ms",
      },
      spacing: {
        "navbar":  "56px",
        "footer":  "40px",
      },
    },
  },
  plugins: [],
};
