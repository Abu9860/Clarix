import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import IndexPanel from "../components/Home/IndexPanel";
import BookPanel from "../components/Home/BookPanel";
import ChatPanel from "../components/Home/ChatPanel";

export default function HomePage() {

    // ── Lifted page state ──────────────────────────────
    // Shared between IndexPanel (sets page on click)
    // and BookPanel (reads page to show correct PDF page)
    const [page, setPage] = useState(1);

    // ── Panel widths for drag resizing ─────────────────
    const [indexWidth, setIndexWidth] = useState(260);
    const [chatWidth, setChatWidth] = useState(360);
    const isDraggingIndex = useRef(false);
    const isDraggingChat = useRef(false);
    const containerRef = useRef(null);

    // ── Drag logic ─────────────────────────────────────
    useEffect(() => {
        const onMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (isDraggingIndex.current) {
                const newWidth = Math.min(Math.max(e.clientX - rect.left, 180), 400);
                setIndexWidth(newWidth);
            }
            if (isDraggingChat.current) {
                const newWidth = Math.min(Math.max(rect.right - e.clientX, 260), 500);
                setChatWidth(newWidth);
            }
        };
        const onMouseUp = () => {
            isDraggingIndex.current = false;
            isDraggingChat.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    const startDragIndex = () => {
        isDraggingIndex.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    const startDragChat = () => {
        isDraggingChat.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-light-bg dark:bg-dark-bg">
            <Navbar />

            {/* ── Desktop 3-panel layout ── */}
            <div
                ref={containerRef}
                className="hidden sm:flex panel-layout flex-1 min-h-0"
            >
                <IndexPanel
                    style={{ width: indexWidth, minWidth: indexWidth, flexShrink: 0 }}
                    onPageChange={setPage}
                />

                <div
                    className="clarix-drag-handle hidden md:block"
                    onMouseDown={startDragIndex}
                />

                <BookPanel
                    style={{ flex: 1, minWidth: 0 }}
                    page={page}
                    setPage={setPage}
                />

                <div
                    className="clarix-drag-handle hidden md:block"
                    onMouseDown={startDragChat}
                />

                <ChatPanel
                    style={{ width: chatWidth, minWidth: 360, flexShrink: 0 }}
                />
            </div>

            {/* ── Mobile single panel + tabs ── */}
            <div className="flex sm:hidden flex-1 min-h-0 relative overflow-hidden">
                <MobilePanels page={page} setPage={setPage} />
            </div>

            <Footer className="hidden sm:flex" />
        </div>
    );
}

// ── Mobile tab switcher ────────────────────────────────
function MobilePanels({ page, setPage }) {
    const [activeTab, setActiveTab] = useState("book");

    const tabs = [
        { id: "index", label: "Index", icon: "📑" },
        { id: "book",  label: "Read",  icon: "📖" },
        { id: "chat",  label: "Chat",  icon: "💬" },
    ];

    // When IndexPanel triggers page change on mobile,
    // also auto-switch to the book tab so student sees the PDF
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setActiveTab("book");
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex-1 min-h-0 overflow-hidden">
                {activeTab === "index" && (
                    <IndexPanel
                        style={{ width: "100%", height: "100%" }}
                        onPageChange={handlePageChange}
                    />
                )}
                {activeTab === "book" && (
                    <BookPanel
                        style={{ width: "100%", height: "100%" }}
                        page={page}
                        setPage={setPage}
                    />
                )}
                {activeTab === "chat" && (
                    <ChatPanel
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
            </div>

            {/* Bottom tab bar */}
            <div className="flex-shrink-0 flex items-stretch h-12 border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface z-40">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-2xs font-medium transition-colors duration-200 ${
                            activeTab === tab.id
                                ? "text-brand-500"
                                : "text-light-muted dark:text-dark-muted"
                        }`}
                    >
                        <span className="text-base leading-none">{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}