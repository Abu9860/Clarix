import { useTheme } from '../context/ThemeContext';
import StarCanvas from '../components/landing/StarCanvas';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import Footer from '../components/landing/Footer';
import useScrollReveal from '../hooks/useScrollReveal';

export default function LandingPage() {
  const { isDark } = useTheme();

  useScrollReveal();

  const pageBg = isDark
    ? 'linear-gradient(160deg, #0d0618 0%, #110920 40%, #0d0618 100%)'
    : 'linear-gradient(160deg, #f5f3ff 0%, #ede9fe 40%, #f5f3ff 100%)';

  return (
    <>
      <StarCanvas isDark={isDark} />
      <div
        className="min-h-screen flex flex-col relative transition-colors duration-500"
        style={{ background: pageBg }}
      >
        {/* Animated blobs layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        {/* Content */}
        <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>
          <Navbar />
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <Footer />
        </div>
      </div>
    </>
  );
}
