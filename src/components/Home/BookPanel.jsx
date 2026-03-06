import { useState } from "react";

const BookmarkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const loremParagraphs = [
    "Once upon a time, in a hot and dry land, a thirsty crow flew for miles searching desperately for water. The summer sun beat down fiercely, and the crow's parched throat ached with every wingbeat. All the rivers and ponds had dried up in the terrible heat, and the crow began to despair of ever finding relief.",
    "After a long and exhausting search, the clever crow finally spotted a tall clay pitcher sitting beside a farmhouse. Filled with excitement, the crow swooped down and peered inside. There was water at the bottom — but only a little, and the pitcher's neck was far too narrow and tall for the crow's beak to reach it.",
    "The crow tried tilting the pitcher, but it was too heavy. It tried reaching in with one wing, but the water remained out of reach. Other birds might have given up and flown away, but this crow had a sharp and determined mind. It perched on the rim of the pitcher and looked around thoughtfully.",
    "Scattered on the ground nearby were many small pebbles. A brilliant idea struck the crow! One by one, the crow began picking up pebbles in its beak and dropping them carefully into the pitcher. With each pebble, the water level rose a tiny bit higher. The crow worked steadily, pebble by pebble, never giving up.",
];

const loremParagraphs2 = [
    "After a long while, the water finally rose high enough for the crow to reach it with its beak. Gratefully, the clever crow drank deeply and quenched its terrible thirst. Refreshed and satisfied, the crow flew off into the sky with a joyful caw. That day, patience and clever thinking had saved its life.",
    "The story of the thirsty crow has been told for thousands of years because its lesson is timeless: when faced with a difficult problem, do not give up. Instead, think carefully and take steady, determined action. Step by step, even the most difficult challenges can be overcome with persistence and creativity.",
];

export default function BookPanel({ style }) {
    const [fontSize, setFontSize] = useState(14);

    return (
        <main className="clarix-book-panel" style={style}>
            <div className="p-6 max-w-3xl mx-auto">
                {/* Breadcrumb row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                        <button className="breadcrumb-item">Aesop's Fables</button>
                        <span className="breadcrumb-separator">›</span>
                        <span className="breadcrumb-active">The Thirsty Crow</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            className="btn-icon-sm text-xs font-bold"
                            onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                            title="Decrease font size"
                        >
                            A<span className="text-2xs">-</span>
                        </button>
                        <button
                            className="btn-icon-sm text-xs font-bold"
                            onClick={() => setFontSize((f) => Math.min(20, f + 1))}
                            title="Increase font size"
                        >
                            A<span className="text-xs">+</span>
                        </button>
                        <button className="btn-icon-sm" title="Bookmark">
                            <BookmarkIcon />
                        </button>
                    </div>
                </div>

                {/* Chapter image banner */}
                <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-brand-900/40 to-dark-border dark:from-brand-900/60 dark:to-dark-bg mb-6 flex items-center justify-center overflow-hidden border border-light-border dark:border-dark-border">
                    <span className="text-6xl select-none">🐦‍⬛</span>
                </div>

                {/* Chapter heading */}
                <h1 className="font-display font-bold text-2xl text-light-text dark:text-dark-text mb-4 tracking-tight">
                    The Thirsty Crow
                </h1>

                {/* First 4 paragraphs */}
                {loremParagraphs.map((para, i) => (
                    <p
                        key={i}
                        className="leading-relaxed text-light-text dark:text-dark-text mb-4"
                        style={{ fontSize: fontSize }}
                    >
                        {para}
                    </p>
                ))}

                {/* Vocabulary callout */}
                <div className="vocab-callout mb-6">
                    <p className="section-label mb-3">Key Vocabulary</p>
                    <div className="flex flex-col gap-2">
                        <div>
                            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">Parched</span>
                            <span className="text-sm text-light-subtext dark:text-dark-subtext"> — Extremely thirsty or dry; withered from heat.</span>
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">Persistence</span>
                            <span className="text-sm text-light-subtext dark:text-dark-subtext"> — Continuing to do something despite difficulty; determination.</span>
                        </div>
                    </div>
                </div>

                {/* More paragraphs */}
                {loremParagraphs2.map((para, i) => (
                    <p
                        key={i}
                        className="leading-relaxed text-light-text dark:text-dark-text mb-4"
                        style={{ fontSize: fontSize }}
                    >
                        {para}
                    </p>
                ))}

                {/* Bottom nav row */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-light-border dark:border-dark-border">
                    <button className="btn-ghost">← Previous Chapter</button>
                    <button className="btn-primary">Next: The Fox &amp; Grapes →</button>
                </div>
            </div>
        </main>
    );
}
