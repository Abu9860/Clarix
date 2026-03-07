import { useState, useEffect, useRef } from "react";
import { databases, DATABASE_ID, COLLECTION_ID_books } from "../../lib/appwrite";

// ── Icons ──────────────────────────────────────────────
const BookmarkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const PageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="15" x2="13" y2="15" />
    </svg>
);

const ScrollIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <rect x="4" y="2" width="16" height="8" rx="1" />
        <rect x="4" y="14" width="16" height="8" rx="1" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <polyline points="9 12.5 12 14 15 12.5" />
    </svg>
);

// page and setPage are lifted to HomePage so IndexPanel can also control the page
export default function BookPanel({ style, page, setPage }) {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [viewMode, setViewMode] = useState("page");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [containerHeight, setContainerHeight] = useState(0);
    const iframeRef = useRef(null);
    const containerRef = useRef(null);

    const isMobile = windowWidth < 640;

    // ── Resize listener ────────────────────────────────
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ── Measure container for exact iframe height ──────
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerHeight(Math.floor(entry.contentRect.height));
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // ── Fetch books ────────────────────────────────────
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_books);
                setBooks(res.documents);
                if (res.documents.length > 0) setSelectedBook(res.documents[0]);
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Failed to load books.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    useEffect(() => { setPage(1); }, [selectedBook]);
    useEffect(() => { setPage(1); setPdfLoading(true); }, [viewMode]);

    // ── Responsive PDF width ───────────────────────────
    const getPdfWidth = () => {
        if (windowWidth < 640)  return "100%";
        if (windowWidth < 768)  return "min(100%, 420px)";
        if (windowWidth < 1024) return "min(100%, 520px)";
        if (windowWidth < 1280) return "min(100%, 600px)";
        return "min(100%, 580px)";
    };

    // ── PDF URL ────────────────────────────────────────
    const getPdfUrl = (book, pageNum, mode) => {
        if (!book?.coverImageUrl) return null;
        const base = book.coverImageUrl;
        if (mode === "continuous") {
            return `${base}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
        }
        return `${base}#page=${pageNum}&toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-fit`;
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        setPdfLoading(true);
        setPage(newPage);
    };

    // ── States ─────────────────────────────────────────
    if (loading) {
        return (
            <main className="clarix-book-panel" style={style}>
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                        <p className="text-sm text-light-muted dark:text-dark-muted">Loading books...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="clarix-book-panel" style={style}>
                <div className="flex items-center justify-center h-full p-6 text-center">
                    <div>
                        <p className="text-2xl mb-2">⚠️</p>
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                </div>
            </main>
        );
    }

    if (books.length === 0) {
        return (
            <main className="clarix-book-panel" style={style}>
                <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-light-muted dark:text-dark-muted">No books found.</p>
                </div>
            </main>
        );
    }

    const pdfUrl = getPdfUrl(selectedBook, page, viewMode);
    const iframeHeight = containerHeight > 0 ? `${containerHeight}px` : (isMobile ? "65vh" : "100%");

    return (
        <main className="clarix-book-panel" style={style}>
            {/*
                CRITICAL: overflow-hidden on outer div ONLY.
                Inner elements must NOT overflow or push nav off screen.
                flex flex-col with fixed top/bottom bars and flex-1 middle.
            */}
            <div className="w-full h-full flex flex-col" style={{ overflow: "hidden" }}>

                {/* ── Top Bar — ALWAYS VISIBLE ──────────────── */}
                <div
                    className="flex items-center justify-between px-3 py-2 border-b border-light-border dark:border-dark-border bg-light-panel2 dark:bg-dark-panel2"
                    style={{ flexShrink: 0, zIndex: 10 }}
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                        <span className="breadcrumb-item whitespace-nowrap hidden sm:block cursor-default">
                            Textbooks
                        </span>
                        <span className="breadcrumb-separator hidden sm:block">›</span>
                        <span className="breadcrumb-active truncate text-xs max-w-[130px] sm:max-w-none">
                            {selectedBook?.title || "Select a book"}
                        </span>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">

                        {/* ── View Mode Toggle ──
                            On mobile: always show both icons (no text labels)
                            On desktop: show icon + text label
                        ── */}
                        <div className="flex items-center rounded-lg border border-light-border dark:border-dark-border overflow-hidden h-7">
                            <button
                                onClick={() => setViewMode("page")}
                                title="Page by page"
                                className={`flex items-center gap-1 px-2 h-full text-2xs font-medium transition-all duration-250 ${
                                    viewMode === "page"
                                        ? "bg-brand-600 text-white"
                                        : "text-light-muted dark:text-dark-muted hover:bg-light-border dark:hover:bg-dark-border"
                                }`}
                            >
                                <PageIcon />
                                {/* Text label: hidden on mobile, shown on sm+ */}
                                <span className="hidden sm:inline">Page</span>
                            </button>
                            <div className="w-px h-full bg-light-border dark:bg-dark-border" />
                            <button
                                onClick={() => setViewMode("continuous")}
                                title="Continuous scroll"
                                className={`flex items-center gap-1 px-2 h-full text-2xs font-medium transition-all duration-250 ${
                                    viewMode === "continuous"
                                        ? "bg-brand-600 text-white"
                                        : "text-light-muted dark:text-dark-muted hover:bg-light-border dark:hover:bg-dark-border"
                                }`}
                            >
                                <ScrollIcon />
                                <span className="hidden sm:inline">Scroll</span>
                            </button>
                        </div>

                        <button className="btn-icon-sm" title="Bookmark">
                            <BookmarkIcon />
                        </button>
                    </div>
                </div>

                {/* Book Selector — only if multiple books */}
                {books.length > 1 && (
                    <div
                        className="flex gap-1.5 px-3 py-1.5 border-b border-light-border dark:border-dark-border overflow-x-auto scrollbar-hide"
                        style={{ flexShrink: 0 }}
                    >
                        {books.map((book) => (
                            <button
                                key={book.$id}
                                onClick={() => setSelectedBook(book)}
                                className={`px-2.5 py-1 rounded-lg text-2xs font-medium whitespace-nowrap transition-all duration-250 border flex-shrink-0 ${
                                    selectedBook?.$id === book.$id
                                        ? "bg-brand-600 text-white border-brand-600"
                                        : "border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext hover:border-brand-400"
                                }`}
                            >
                                {book.title}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── PDF Viewer — flex-1 fills remaining space ─
                    ref={containerRef} measures exact height via ResizeObserver
                    so iframe gets a real pixel height on mobile too
                ─────────────────────────────────────────────── */}
                <div
                    ref={containerRef}
                    style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden", width: "100%" }}
                >
                    {/* Loading spinner */}
                    {pdfLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-light-panel2/80 dark:bg-dark-panel2/80">
                            <div className="w-6 h-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                        </div>
                    )}

                    {pdfUrl ? (
                        <div
                            className="w-full flex justify-center items-start bg-light-panel2 dark:bg-dark-panel2"
                            style={{
                                height: iframeHeight,
                                // ── KEY FIX: disable scroll on desktop page mode ──
                                // In page mode on desktop, the iframe handles its own
                                // rendering — no outer scroll needed
                                overflowY: (!isMobile && viewMode === "page") ? "hidden" : "auto",
                            }}
                        >
                            <iframe
                                ref={iframeRef}
                                key={`${selectedBook?.$id}-${viewMode}-${page}`}
                                src={pdfUrl}
                                title={selectedBook?.title}
                                onLoad={() => setPdfLoading(false)}
                                style={{
                                    display: "block",
                                    border: "none",
                                    width: getPdfWidth(),
                                    height: iframeHeight,
                                    flexShrink: 0,
                                    transition: "width 250ms ease",
                                }}
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-4xl mb-3">📄</p>
                                <p className="text-sm text-light-muted dark:text-dark-muted">No PDF available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Bottom Nav — ALWAYS VISIBLE ───────────────
                    flexShrink: 0 prevents this from being compressed
                    zIndex: 10 keeps it above the PDF on mobile
                    Both page nav and continuous hint live here
                ─────────────────────────────────────────────── */}
                <div
                    className="border-t border-light-border dark:border-dark-border bg-light-panel2 dark:bg-dark-panel2"
                    style={{ flexShrink: 0, zIndex: 10 }}
                >
                    {viewMode === "page" ? (
                        <div className="flex items-center justify-between px-4 py-2">
                            <button
                                className="btn-ghost flex items-center gap-1 py-1.5 px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft />
                                <span>Previous</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                                <span className="text-2xs font-mono text-light-muted dark:text-dark-muted">Page</span>
                                <span className="clarix-badge">{page}</span>
                            </div>

                            <button
                                className="btn-primary flex items-center gap-1 py-1.5 px-3 text-xs"
                                onClick={() => handlePageChange(page + 1)}
                            >
                                <span>Next</span>
                                <ChevronRight />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center px-3 py-2">
                            <span className="text-2xs text-light-muted dark:text-dark-muted font-mono tracking-wide">
                                Scroll mode — swipe to navigate pages
                            </span>
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}