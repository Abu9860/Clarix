import { useState, useEffect } from "react";
import { databases, DATABASE_ID, COLLECTION_ID_indexs } from "../../lib/appwrite";

// ── Icons ──────────────────────────────────────────────
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

const BookOpenIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

// ─────────────────────────────────────────────────────────
// Actual Appwrite schema:
//   chapter_no   — number
//   title        — string
//   page_start   — number  ← clicking jumps PDF here
//   page_end     — number
//   unit         — string  ← used to group chapters
//   book_id      — string
// ─────────────────────────────────────────────────────────
export default function IndexPanel({ style, onPageChange, onChapterChange }) {

    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [expandedUnits, setExpandedUnits] = useState({});
    const [search, setSearch] = useState("");

    // ── Fetch all chapters ─────────────────────────────
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID_indexs
                );

                // Sort by chapter_no so order is always correct
                const sorted = res.documents.sort(
                    (a, b) => (a.chapter_no || 0) - (b.chapter_no || 0)
                );

                setChapters(sorted);

                // Auto-expand all units on load
                const units = [...new Set(sorted.map(c => c.unit).filter(Boolean))];
                const allExpanded = {};
                units.forEach(u => { allExpanded[u] = true; });
                setExpandedUnits(allExpanded);

                // Auto-select + jump to first chapter
                if (sorted.length > 0) {
                    setActiveChapterId(sorted[0].$id);
                    if (onPageChange && sorted[0].page_start) {
                        onPageChange(sorted[0].page_start);
                    }
                    if (onChapterChange) {
                        onChapterChange(sorted[0].title || "");
                    }
                }
            } catch (err) {
                console.error("Error fetching chapters:", err);
                setError("Failed to load chapters.");
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, []);

    // ── Click a chapter row ────────────────────────────
    const handleChapterClick = (chapter) => {
        setActiveChapterId(chapter.$id);
        // Jump PDF to page_start
        if (onPageChange && chapter.page_start) {
            onPageChange(chapter.page_start);
        }
        // Notify parent of the active chapter title
        if (onChapterChange) {
            onChapterChange(chapter.title || "");
        }
    };

    const toggleUnit = (unit) => {
        setExpandedUnits(prev => ({ ...prev, [unit]: !prev[unit] }));
    };

    // ── Filter ─────────────────────────────────────────
    const filteredChapters = chapters.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.unit?.toLowerCase().includes(search.toLowerCase())
    );

    // ── Group by unit ──────────────────────────────────
    const groupedByUnit = filteredChapters.reduce((acc, chapter) => {
        const unit = chapter.unit || "Chapters";
        if (!acc[unit]) acc[unit] = [];
        acc[unit].push(chapter);
        return acc;
    }, {});

    // ── Progress ───────────────────────────────────────
    const activeIndex = chapters.findIndex(c => c.$id === activeChapterId);
    const progressPct = chapters.length > 0
        ? Math.round(((activeIndex + 1) / chapters.length) * 100)
        : 0;

    return (
        <aside className="clarix-index-panel" style={style}>
            <div className="p-4 flex flex-col gap-3 h-full overflow-hidden">

                {/* ── Book Info ──────────────────────────── */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-light-border dark:bg-dark-border flex-shrink-0 flex items-center justify-center text-2xl select-none">
                        📖
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-light-text dark:text-dark-text leading-tight truncate">
                            {loading ? "Loading..." : "Textbook"}
                        </p>
                        <p className="text-xs text-light-subtext dark:text-dark-subtext mt-0.5">
                            {chapters.length} Chapter{chapters.length !== 1 ? "s" : ""}
                        </p>
                        <span className="clarix-badge mt-1 inline-block">
                            {loading ? "—" : "Loaded"}
                        </span>
                    </div>
                </div>

                {/* ── Search ────────────────────────────── */}
                <div className="relative flex-shrink-0">
                    <SearchIcon />
                    <input
                        type="text"
                        className="clarix-search pl-8"
                        placeholder="Search chapters..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* ── Table of Contents ─────────────────── */}
                <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto min-h-0">
                    <p className="section-label mb-2 flex-shrink-0">Table of Contents</p>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="text-center py-6">
                            <p className="text-xs text-red-500">{error}</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && filteredChapters.length === 0 && (
                        <div className="text-center py-6">
                            <p className="text-xs text-light-muted dark:text-dark-muted">
                                {search ? "No chapters match your search." : "No chapters found."}
                            </p>
                        </div>
                    )}

                    {/* Chapters grouped by unit */}
                    {!loading && !error && Object.entries(groupedByUnit).map(([unit, unitChapters]) => (
                        <div key={unit} className="mb-1">

                            {/* Unit header — collapsible */}
                            <button
                                className="w-full flex items-center justify-between px-2 py-1.5 mb-0.5 rounded-lg text-2xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted hover:bg-light-border dark:hover:bg-dark-border transition-colors duration-200"
                                onClick={() => toggleUnit(unit)}
                            >
                                <span>{unit}</span>
                                {expandedUnits[unit] ? <ChevronDown /> : <ChevronRight />}
                            </button>

                            {/* Chapter rows */}
                            {expandedUnits[unit] && unitChapters.map((chapter) => {
                                const isActive = activeChapterId === chapter.$id;
                                return (
                                    <button
                                        key={chapter.$id}
                                        className={`chapter-item w-full ${isActive ? "active" : ""}`}
                                        onClick={() => handleChapterClick(chapter)}
                                    >
                                        {/* Chapter number dot */}
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold flex-shrink-0 ${
                                            isActive
                                                ? "bg-brand-600 text-white"
                                                : "bg-light-border dark:bg-dark-border text-light-subtext dark:text-dark-subtext"
                                        }`}>
                                            {chapter.chapter_no}
                                        </span>

                                        {/* Title */}
                                        <span className="truncate text-left flex-1 text-xs">
                                            {chapter.title}
                                        </span>

                                        {/* Page range badge */}
                                        <span className="ml-auto text-2xs font-mono text-light-muted dark:text-dark-muted flex-shrink-0 flex items-center gap-0.5 opacity-70">
                                            <BookOpenIcon />
                                            {chapter.page_start}
                                            {chapter.page_end && chapter.page_end !== chapter.page_start
                                                ? `–${chapter.page_end}`
                                                : ""}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* ── Progress ──────────────────────────── */}
                <div className="pt-3 border-t border-light-border dark:border-dark-border flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <p className="section-label">Progress</p>
                        <p className="section-label">{progressPct}%</p>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

            </div>
        </aside>
    );
}