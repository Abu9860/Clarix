import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import IndexPanel from "../components/Home/IndexPanel";
import BookPanel from "../components/Home/BookPanel";
import ChatPanel from "../components/Home/ChatPanel";

// Mobile tab bar icons
const BookOpenIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

const FileTextIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const PANEL_DEFAULTS = {
    index: 260,
    chat: 360,
};
const PANEL_LIMITS = {
    index: { min: 200, max: 340 },
    chat: { min: 260, max: 520 },
};

export default function HomePage() {
    // Panel widths
    const [indexWidth, setIndexWidth] = useState(PANEL_DEFAULTS.index);
    const [chatWidth, setChatWidth] = useState(PANEL_DEFAULTS.chat);

    // Mobile: which tab is active — "index" | "book" | "chat"
    const [mobileTab, setMobileTab] = useState("book");
    // Tablet: show index sidebar via hamburger
    const [showIndexMd, setShowIndexMd] = useState(false);

    // Drag refs
    const isDraggingLeft = useRef(false);
    const isDraggingRight = useRef(false);
    const dragStartX = useRef(0);
    const dragStartWidth = useRef(0);

    const containerRef = useRef(null);

    // ── Drag: Index panel (left handle) ────────────────
    const onLeftDragStart = useCallback((e) => {
        isDraggingLeft.current = true;
        dragStartX.current = e.clientX;
        dragStartWidth.current = indexWidth;
        e.preventDefault();
    }, [indexWidth]);

    // ── Drag: Chat panel (right handle) ────────────────
    const onRightDragStart = useCallback((e) => {
        isDraggingRight.current = true;
        dragStartX.current = e.clientX;
        dragStartWidth.current = chatWidth;
        e.preventDefault();
    }, [chatWidth]);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (isDraggingLeft.current) {
                const delta = e.clientX - dragStartX.current;
                const newWidth = Math.min(
                    PANEL_LIMITS.index.max,
                    Math.max(PANEL_LIMITS.index.min, dragStartWidth.current + delta)
                );
                setIndexWidth(newWidth);
            }
            if (isDraggingRight.current) {
                const delta = dragStartX.current - e.clientX;
                const newWidth = Math.min(
                    PANEL_LIMITS.chat.max,
                    Math.max(PANEL_LIMITS.chat.min, dragStartWidth.current + delta)
                );
                setChatWidth(newWidth);
            }
        };
        const onMouseUp = () => {
            isDraggingLeft.current = false;
            isDraggingRight.current = false;
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-light-bg dark:bg-dark-bg">
            {/* Navbar */}
            <Navbar onMenuClick={() => setShowIndexMd((v) => !v)} />

            {/* ── Desktop & Tablet — Three Panel Layout ───── */}
            <div
                ref={containerRef}
                className="hidden sm:flex panel-layout select-none"
            >
                {/* Index panel — hidden on tablet by default, toggled by hamburger */}
                <div className="hidden md:block">
                    <IndexPanel style={{ width: indexWidth, minWidth: indexWidth }} />
                </div>
                {/* Tablet index panel overlay */}
                {showIndexMd && (
                    <div className="md:hidden block">
                        <IndexPanel style={{ width: indexWidth, minWidth: indexWidth }} />
                    </div>
                )}

                {/* Left drag handle — desktop only */}
                <div
                    className="clarix-drag-handle hidden md:block"
                    onMouseDown={onLeftDragStart}
                />

                {/* Book panel — fills remaining space */}
                <BookPanel style={{ flex: 1, minWidth: 0 }} />

                {/* Right drag handle — desktop only */}
                <div
                    className="clarix-drag-handle hidden md:block"
                    onMouseDown={onRightDragStart}
                />

                {/* Chat panel */}
                <ChatPanel style={{ width: chatWidth, minWidth: chatWidth }} />
            </div>

            {/* ── Mobile — Single panel view ───────────────── */}
            <div className="sm:hidden flex-1 overflow-hidden">
                {mobileTab === "index" && <IndexPanel style={{ width: "100%", height: "100%" }} />}
                {mobileTab === "book" && <BookPanel style={{ width: "100%", height: "100%" }} />}
                {mobileTab === "chat" && <ChatPanel style={{ width: "100%", height: "100%" }} />}
            </div>

            {/* ── Footer — hidden on mobile ────────────────── */}
            <Footer />

            {/* ── Mobile Bottom Tab Bar ───────────────────── */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 h-12 flex items-stretch bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border z-40">
                {[
                    { id: "index", label: "Index", Icon: BookOpenIcon },
                    { id: "book", label: "Read", Icon: FileTextIcon },
                    { id: "chat", label: "Chat", Icon: MessageIcon },
                ].map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        onClick={() => setMobileTab(id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-2xs font-medium transition-colors duration-250 ${mobileTab === id
                                ? "text-brand-500"
                                : "text-light-muted dark:text-dark-muted"
                            }`}
                    >
                        <Icon />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
