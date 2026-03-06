import { useState } from "react";

const ChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const chapters = [
    { id: 1, title: "The Thirsty Crow", subItems: ["Reading", "Quiz", "Vocabulary"] },
    { id: 2, title: "The Fox & Grapes", subItems: ["Reading", "Quiz", "Vocabulary"] },
    { id: 3, title: "The Lion & Mouse", subItems: ["Reading", "Quiz", "Vocabulary"] },
    { id: 4, title: "The Tortoise & Hare", subItems: ["Reading", "Quiz", "Vocabulary"] },
    { id: 5, title: "The Ant & Grasshopper", subItems: ["Reading", "Quiz", "Vocabulary"] },
];

export default function IndexPanel({ style }) {
    const [expandedChapters, setExpandedChapters] = useState({ 1: true });
    const [activeSubItem, setActiveSubItem] = useState({ chapterId: 1, item: "Reading" });
    const [search, setSearch] = useState("");

    const toggleChapter = (id) => {
        setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredChapters = chapters.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <aside className="clarix-index-panel" style={style}>
            <div className="p-4 flex flex-col gap-3 h-full">
                {/* Book info */}
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-light-border dark:bg-dark-border flex-shrink-0 flex items-center justify-center text-2xl">
                        📖
                    </div>
                    <div>
                        <p className="text-sm font-bold text-light-text dark:text-dark-text leading-tight">Aesop's Fables</p>
                        <p className="text-xs text-light-subtext dark:text-dark-subtext mt-0.5">Grade 4 English</p>
                        <span className="clarix-badge mt-1 inline-block">Literature</span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <SearchIcon />
                    <input
                        type="text"
                        className="clarix-search pl-8"
                        placeholder="Search chapters..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* TOC */}
                <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
                    <p className="section-label mb-2">Table of Contents</p>
                    {filteredChapters.map((chapter) => (
                        <div key={chapter.id}>
                            <button
                                className={`chapter-item ${expandedChapters[chapter.id] ? "active" : ""}`}
                                onClick={() => toggleChapter(chapter.id)}
                            >
                                <span>{chapter.id}. {chapter.title}</span>
                                {expandedChapters[chapter.id] ? <ChevronDown /> : <ChevronRight />}
                            </button>
                            {expandedChapters[chapter.id] && (
                                <div className="mt-0.5 mb-1 flex flex-col gap-0.5">
                                    {chapter.subItems.map((item) => {
                                        const isActive = activeSubItem.chapterId === chapter.id && activeSubItem.item === item;
                                        return (
                                            <button
                                                key={item}
                                                className={`chapter-sub-item ${isActive ? "active" : ""}`}
                                                onClick={() => setActiveSubItem({ chapterId: chapter.id, item })}
                                            >
                                                <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress */}
                <div className="mt-auto pt-3 border-t border-light-border dark:border-dark-border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="section-label">Progress</p>
                        <p className="section-label">24%</p>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: "24%" }} />
                    </div>
                </div>
            </div>
        </aside>
    );
}
