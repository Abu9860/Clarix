import { useState, useRef, useEffect } from "react";

// ── Appwrite Config ────────────────────────────────────
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || "";
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
const APPWRITE_CHATS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID_chats || "chats";

// ── Validate required env vars ────────────────────────
const validateAppwriteConfig = () => {
    if (!APPWRITE_ENDPOINT) console.warn("Warning: VITE_APPWRITE_ENDPOINT is not configured");
    if (!APPWRITE_PROJECT_ID) console.warn("Warning: VITE_APPWRITE_PROJECT_ID is not configured");
    if (!APPWRITE_DATABASE_ID) console.warn("Warning: VITE_APPWRITE_DATABASE_ID is not configured");
};

validateAppwriteConfig();

const GUEST_USER_ID = "1"; // Default user ID for non-logged-in users

async function saveMessageToAppwrite({ senderId, receiverId, messageContent, chatType = "text" }) {
    try {
        if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_DATABASE_ID) {
            console.warn("Appwrite config incomplete. Message not saved.");
            return;
        }
        const url = `${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/collections/${APPWRITE_CHATS_COLLECTION_ID}/documents`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Appwrite-Project": APPWRITE_PROJECT_ID,
            },
            body: JSON.stringify({
                documentId: "unique()",
                data: {
                    senderId,
                    receiverId,
                    messageContent,
                    timestamp: new Date().toISOString(),
                    chatType,
                    isRead: false,
                    priority: "medium",
                },
            }),
        });
        if (!res.ok) {
            const err = await res.json();
            console.warn("Appwrite save failed:", err);
        }
    } catch (e) {
        console.warn("Appwrite save error:", e.message);
    }
}

// ── SVG Icons ──────────────────────────────────────────
const SendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const MicIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

const HistoryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
    </svg>
);

const MoreIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="19" r="1" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const SpeakerIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
);

const StopCircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <circle cx="12" cy="12" r="10" />
        <rect x="9" y="9" width="6" height="6" />
    </svg>
);

// ── Pop Card Component ─────────────────────────────────
function PopCard({ chip, onClose, onConfirm }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                onClick={onClose}
                style={{ animation: "fadeIn 0.15s ease" }}
            />

            {/* Card */}
            <div
                className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
                <div
                    style={{
                        background: "var(--card-bg, #1a1a2e)",
                        border: "1px solid var(--card-border, rgba(255,255,255,0.12))",
                        borderRadius: "16px",
                        padding: "24px 28px",
                        minWidth: "220px",
                        maxWidth: "280px",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)",
                        textAlign: "center",
                        position: "relative",
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(255,255,255,0.08)",
                            border: "none",
                            borderRadius: "6px",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "rgba(255,255,255,0.5)",
                        }}
                    >
                        <XIcon />
                    </button>

                    {/* Emoji */}
                    <div style={{ fontSize: "32px", marginBottom: "8px", lineHeight: 1 }}>👋</div>

                    {/* "hee" text */}
                    <p
                        style={{
                            fontSize: "22px",
                            fontWeight: "700",
                            color: "#fff",
                            letterSpacing: "-0.5px",
                            margin: "0 0 6px",
                        }}
                    >
                        hee
                    </p>

                    {/* Chip label */}
                    <p
                        style={{
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.45)",
                            margin: "0 0 18px",
                        }}
                    >
                        Sending: <em style={{ color: "rgba(255,255,255,0.7)" }}>{chip}</em>
                    </p>

                    {/* Confirm button */}
                    <button
                        onClick={() => { onConfirm(chip); onClose(); }}
                        style={{
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 20px",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            width: "100%",
                            letterSpacing: "0.2px",
                            transition: "opacity 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        Send it →
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes popIn {
                    0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.82); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
            `}</style>
        </>
    );
}

// ── Initial demo messages ──────────────────────────────
const DEMO_MESSAGES = [
    {
        id: 1,
        role: "ai",
        response: "Hi! I'm your AI Tutor for Aesop's Fables. I can help you understand the story of The Thirsty Crow, quiz you on vocabulary, or explain the moral. What would you like to explore?",
        showChips: true,
    },
];

const QUICK_CHIPS = ["Generate Slides"];

export default function ChatPanel({ style, bookTitle = "Unknown", pageNumber = 0 }) {
    const [messages, setMessages] = useState(DEMO_MESSAGES);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [popChip, setPopChip] = useState(null); // which chip triggered the pop card
    const [speakingMsgId, setSpeakingMsgId] = useState(null); // which msg is being read aloud
    const currentAudioRef = useRef(null); // ref to current playing audio
    const chatScrollRef = useRef(null);
    const textareaRef = useRef(null);

    // ── Read Aloud via Puter.js TTS ────────────────────
    const handleReadAloud = async (msgId, text) => {
        // If already playing this message, stop it
        if (speakingMsgId === msgId) {
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
                currentAudioRef.current = null;
            }
            setSpeakingMsgId(null);
            return;
        }

        // Stop any currently playing audio
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }

        try {
            setSpeakingMsgId(msgId);
            // Use Puter.js free TTS — no API key needed
            const audio = await window.puter.ai.txt2speech(text, "en-US");
            currentAudioRef.current = audio;
            audio.play();
            audio.onended = () => {
                setSpeakingMsgId(null);
                currentAudioRef.current = null;
            };
        } catch (err) {
            console.error("TTS Error:", err);
            setSpeakingMsgId(null);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
        }
    };

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed) return;

        const userMsg = { id: Date.now(), role: "user", text: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";

        // ── Save USER message to Appwrite ──────────────
        await saveMessageToAppwrite({
            senderId: GUEST_USER_ID,
            receiverId: "ai_tutor",
            messageContent: trimmed,
            chatType: "text",
        });

        // ── n8n Webhook ────────────────────────────────
        setIsTyping(true);
        try {
            const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_CHAT;
            if (!webhookUrl) throw new Error("VITE_N8N_WEBHOOK_CHAT is missing in .env file");

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    chatHistory: messages.map((m) => ({
                        role: m.role,
                        text: m.role === "user" ? m.text : m.response,
                    })),
                    bookTitle,
                    pageNumber,
                }),
            });

            if (!response.ok) throw new Error(`Webhook responded with status ${response.status}`);

            const rawText = await response.text();
            let aiResponseText = rawText;
            try {
                const parsed = JSON.parse(rawText);
                aiResponseText =
                    parsed.output || parsed.text || parsed.message || parsed.reply ||
                    parsed.response || parsed.answer ||
                    (Array.isArray(parsed) && parsed[0]?.output) ||
                    (Array.isArray(parsed) && parsed[0]?.text) ||
                    rawText;
            } catch {
                aiResponseText = rawText;
            }

            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                response: aiResponseText || "I received your message but got an empty response.",
                showChips: false,
            };
            setMessages((prev) => [...prev, aiMsg]);

            // ── Save AI reply to Appwrite ──────────────
            await saveMessageToAppwrite({
                senderId: "ai_tutor",
                receiverId: GUEST_USER_ID,
                messageContent: aiResponseText || "",
                chatType: "text",
            });

        } catch (error) {
            console.error("Chat Error:", error.message);
            const errMsg = {
                id: Date.now() + 1,
                role: "ai",
                response: `⚠️ ${error.message}`,
                showChips: false,
            };
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Chip click → show pop card
    const handleChipClick = (chip) => {
        setPopChip(chip);
    };

    return (
        <>
            {/* ── Pop Card ───────────────────────────── */}
            {popChip && (
                <PopCard
                    chip={popChip}
                    onClose={() => setPopChip(null)}
                    onConfirm={(chip) => sendMessage(chip)}
                />
            )}

            <section className="clarix-chat-panel" style={style}>
                {/* ── Panel Header ──────────────────────── */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-light-border dark:border-dark-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-base select-none">🤖</span>
                        <span className="text-sm font-medium text-light-text dark:text-dark-text">AI Tutor</span>
                        <span className="clarix-badge">Online</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <button className="btn-icon-sm" title="Chat history"><HistoryIcon /></button>
                        <button className="btn-icon-sm" title="Options"><MoreIcon /></button>
                    </div>
                </div>

                {/* ── Chat Scroll Area ──────────────────── */}
                <div id="chat-container" ref={chatScrollRef} className="chat-scroll-area">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-sm text-light-muted dark:text-dark-muted text-center">
                                Ask me anything about this chapter
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div key={msg.id} className="animate-fade-in-up">
                                    {msg.role === "ai" ? (
                                        <div className="chat-row-ai">
                                            <div className="chat-avatar animate-glow-pulse">🤖</div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="chat-bubble-ai">{msg.response}</div>
                                                <div className="flex items-center gap-1.5">
                                                    {/* Read Aloud Button */}
                                                    <button
                                                        onClick={() => handleReadAloud(msg.id, msg.response)}
                                                        title={speakingMsgId === msg.id ? "Stop reading" : "Read aloud"}
                                                        className="read-aloud-btn"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '3px 8px',
                                                            borderRadius: '6px',
                                                            border: '1px solid var(--color-light-border, rgba(0,0,0,0.1))',
                                                            background: speakingMsgId === msg.id
                                                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                                                : 'transparent',
                                                            color: speakingMsgId === msg.id
                                                                ? '#fff'
                                                                : 'var(--color-light-muted, #888)',
                                                            fontSize: '11px',
                                                            fontWeight: 500,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            animation: speakingMsgId === msg.id
                                                                ? 'tts-pulse 1.5s ease-in-out infinite'
                                                                : 'none',
                                                        }}
                                                    >
                                                        {speakingMsgId === msg.id ? <StopCircleIcon /> : <SpeakerIcon />}
                                                        <span>{speakingMsgId === msg.id ? 'Stop' : 'Listen'}</span>
                                                    </button>
                                                    {msg.showChips && (
                                                        <div className="chat-chips" style={{ marginLeft: '4px' }}>
                                                            {QUICK_CHIPS.map((chip) => (
                                                                <button
                                                                    key={chip}
                                                                    className="chat-chip"
                                                                    onClick={() => handleChipClick(chip)}
                                                                >
                                                                    {chip}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="chat-row-user">
                                            <div className="chat-bubble-user">{msg.text}</div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="chat-row-ai">
                                    <div className="chat-avatar">🤖</div>
                                    <div className="chat-typing">
                                        <span className="chat-typing-dot" />
                                        <span className="chat-typing-dot" />
                                        <span className="chat-typing-dot" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ── Input Area ────────────────────────── */}
                <div className="chat-input-area flex-shrink-0">
                    <div className="chat-input-row">
                        <textarea
                            ref={textareaRef}
                            className="clarix-chat-input"
                            placeholder="Ask a question..."
                            rows={1}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            className="chat-send-btn"
                            onClick={() => sendMessage()}
                            aria-label="Send message"
                            title="Send"
                        >
                            <SendIcon />
                        </button>
                    </div>
                    <p className="chat-disclaimer">AI can make mistakes. Verify important info.</p>
                </div>

                {/* TTS pulse animation */}
                <style>{`
                    @keyframes tts-pulse {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                        50% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
                    }
                    .read-aloud-btn:hover {
                        border-color: #6366f1 !important;
                        color: #6366f1 !important;
                    }
                    .dark .read-aloud-btn {
                        border-color: rgba(255,255,255,0.12) !important;
                    }
                    .dark .read-aloud-btn:hover {
                        border-color: #818cf8 !important;
                        color: #818cf8 !important;
                    }
                `}</style>
            </section>
        </>
    );
}