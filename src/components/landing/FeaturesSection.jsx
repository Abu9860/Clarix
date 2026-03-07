import { useTheme } from '../../context/ThemeContext';

const features = [
  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />, title: 'Personalised AI Paths',   desc: 'Adaptive learning that identifies your weak areas and tailors a custom study roadmap just for you.' },
  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,                                                                                                                                                                                                                                                                               title: 'Available 24/7',          desc: 'Study at midnight or early morning — your AI tutor never sleeps and is always ready to help instantly.' },
  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,                                                                    title: 'Curriculum Aligned',      desc: 'Built for CBSE, ICSE & State Boards — covering every subject from Class 6 to Class 12.' },
  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,                                                                                                                                                                                                title: 'Instant Feedback',        desc: 'Submit answers and get step-by-step explanations with instant scores — no waiting for a teacher.' },
  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,                                                                                                               title: 'Progress Analytics',      desc: 'Track your journey with beautiful charts showing growth, streaks, and subject mastery over time.' },
  { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,                                            title: 'Peer Community',          desc: 'Connect with thousands of students across India, share notes, and solve doubts together in real-time.' },
];

const delays = [1, 2, 3, 1, 2, 3];

export default function FeaturesSection() {
  const { isDark } = useTheme();

  const headingColor = isDark ? '#ffffff'  : '#0f172a';
  const descColor    = isDark ? '#9ca3af'  : '#4b5563';
  const cardBg       = isDark ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.8)';
  const cardBorder   = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(167,139,250,0.35)';
  const iconBg       = isDark ? 'rgba(126,34,206,0.2)'   : 'rgba(237,233,254,1)';
  const iconBorder   = isDark ? 'rgba(168,85,247,0.2)'   : 'rgba(167,139,250,0.4)';
  const iconColor    = isDark ? '#c084fc' : '#7c3aed';
  const cardTitle    = isDark ? '#ffffff'  : '#0f172a';

  return (
    <section id="features" className="px-5 md:px-20 pb-20">
      <div className="text-center mb-10 reveal">
        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: headingColor }}>
          Why Choose <span className="text-purple-500">AI Tutor?</span>
        </h2>
        <p className="mt-3 text-sm md:text-base max-w-lg mx-auto leading-relaxed" style={{ color: descColor }}>
          Everything you need to ace your exams — powered by intelligent AI designed around the Indian curriculum.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className={`feature-card reveal reveal-delay-${delays[i]} rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-sm`}
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: iconColor }}>
                {feature.icon}
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg" style={{ color: cardTitle }}>{feature.title}</h3>
              <p className="text-sm leading-relaxed mt-1" style={{ color: descColor }}>{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
