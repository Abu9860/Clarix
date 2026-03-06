import { useState, useRef, useEffect } from "react";

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

// ── Initial demo messages ──────────────────────────────
const DEMO_MESSAGES = [
    {
        id: 1,
        role: "ai",
        response: "Hi! I'm your AI Tutor for Aesop's Fables. I can help you understand the story of The Thirsty Crow, quiz you on vocabulary, or explain the moral. What would you like to explore?",
        showChips: true,
    },
    {
        id: 2,
        role: "user",
        text: "What is the moral of The Thirsty Crow?",
    },
    {
        id: 3,
        role: "ai",
        response: "The moral of The Thirsty Crow is: \"Necessity is the mother of invention.\" The crow used clever thinking and patience — dropping pebbles one by one — to raise the water level so it could drink. The story teaches us that when facing a tough problem, we should think creatively rather than give up. 💡",
        showChips: false,
    },
];

const QUICK_CHIPS = ["Summarize story", "What is the moral?", "Generate quiz"];

export default function ChatPanel({ style }) {
    const [messages, setMessages] = useState(DEMO_MESSAGES);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatScrollRef = useRef(null);
    const textareaRef = useRef(null);

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Auto-resize textarea
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
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        // ── n8n Webhook Integration ─────────────────────
        setIsTyping(true);
        try {
            const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_CHAT;

            if (!webhookUrl) {
                throw new Error("VITE_N8N_WEBHOOK_CHAT is missing in .env file");
            }

            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    chatHistory: messages.map(m => ({
                        role: m.role,
                        text: m.role === "user" ? m.text : m.response,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(`Webhook responded with status ${response.status}`);
            }

            // ── Read as plain text first (n8n returns plain text not JSON) ──
            const rawText = await response.text();
            console.log("n8n raw response:", rawText);

            // Try to parse as JSON in case n8n returns JSON later
            let aiResponseText = rawText;
            try {
                const parsed = JSON.parse(rawText);
                // Handle all common n8n response formats
                aiResponseText =
                    parsed.output ||
                    parsed.text ||
                    parsed.message ||
                    parsed.reply ||
                    parsed.response ||
                    parsed.answer ||
                    (Array.isArray(parsed) && parsed[0]?.output) ||
                    (Array.isArray(parsed) && parsed[0]?.text) ||
                    rawText;
            } catch {
                // Not JSON — use raw text directly (current n8n behavior)
                aiResponseText = rawText;
            }

            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                response: aiResponseText || "I received your message but got an empty response.",
                showChips: false,
            };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (error) {
            console.error("Chat Error:", error.message);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "ai",
                    response: `⚠️ ${error.message}`,
                    showChips: false,
                },
            ]);
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

    return (
        <section className="clarix-chat-panel" style={style}>
            {/* ── Panel Header ────────────────────────────── */}
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

            {/* ── Chat Scroll Area ─────────────────────────
                AI iframe integration point — id="chat-container"
                Auto-scroll works via useEffect on [messages, isTyping]
            ────────────────────────────────────────────── */}
            <div
                id="chat-container"
                ref={chatScrollRef}
                className="chat-scroll-area"
            >
                {/* AI iframe integration point */}
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
                                            {msg.showChips && (
                                                <div className="chat-chips">
                                                    {QUICK_CHIPS.map((chip) => (
                                                        <button
                                                            key={chip}
                                                            className="chat-chip"
                                                            onClick={() => sendMessage(chip)}
                                                        >
                                                            {chip}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="chat-row-user">
                                        <div className="chat-bubble-user">{msg.text}</div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
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

            {/* ── Input Area — pinned to bottom ────────── */}
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
                        className="btn-icon-sm"
                        title="Voice input"
                        aria-label="Microphone"
                    >
                        <MicIcon />
                    </button>
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
        </section>
    );
}