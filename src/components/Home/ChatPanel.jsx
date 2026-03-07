import { useState, useRef, useEffect, useCallback } from "react";

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

const SlidesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
    </svg>
);

const VideoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

// ── Slide content extractor ────────────────────────────
// Splits an AI response into up to 4 slide topics
function extractSlides(responseText) {
    // Try to find bullet / numbered list items first
    const bulletRegex = /^[\s]*[-•*]\s+(.+)$/gm;
    const numberedRegex = /^[\s]*\d+[.)]\s+(.+)$/gm;

    let items = [];
    let match;

    while ((match = bulletRegex.exec(responseText)) !== null) {
        items.push(match[1].trim());
    }
    if (items.length < 2) {
        items = [];
        while ((match = numberedRegex.exec(responseText)) !== null) {
            items.push(match[1].trim());
        }
    }

    // If we found list items, use up to 4
    if (items.length >= 2) {
        return items.slice(0, 4).map((text, i) => ({
            number: i + 1,
            title: text.length > 60 ? text.slice(0, 57) + "…" : text,
            body: text,
        }));
    }

    // Fallback: split by sentences, group into 3-4 chunks
    const sentences = responseText
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 20);

    const chunkSize = Math.ceil(sentences.length / 3);
    const chunks = [];
    for (let i = 0; i < sentences.length && chunks.length < 4; i += chunkSize) {
        const chunk = sentences.slice(i, i + chunkSize).join(" ");
        chunks.push(chunk);
    }

    if (chunks.length === 0) {
        return [{ number: 1, title: "Summary", body: responseText.slice(0, 200) }];
    }

    return chunks.slice(0, 4).map((chunk, i) => ({
        number: i + 1,
        title: `Point ${i + 1}`,
        body: chunk.length > 180 ? chunk.slice(0, 177) + "…" : chunk,
    }));
}

// ── Generate Slides Modal ──────────────────────────────
function GenerateSlidesModal({ msgId, responseText, onClose }) {
    const slides = extractSlides(responseText);
    const [slideImages, setSlideImages] = useState({}); // { slideIndex: imgSrc | "loading" | "error" }
    const [currentSlide, setCurrentSlide] = useState(0);
    const [allGenerated, setAllGenerated] = useState(false);
    const generatedRef = useRef(false);

    // Generate all slide images on mount
    useEffect(() => {
        if (generatedRef.current) return;
        generatedRef.current = true;

        const generateAll = async () => {
            // Mark all as loading
            const initial = {};
            slides.forEach((_, i) => { initial[i] = "loading"; });
            setSlideImages(initial);

            // Generate in parallel
            await Promise.all(
                slides.map(async (slide, i) => {
                    try {
                        const prompt = `Educational illustration for a school textbook slide about: "${slide.body}". Clean, colorful, child-friendly, flat illustration style, white background, no text.`;
                        const imgEl = await window.puter.ai.txt2img(prompt);
                        const src = imgEl.src; // data URL
                        setSlideImages(prev => ({ ...prev, [i]: src }));
                    } catch (err) {
                        console.error(`Slide ${i + 1} image error:`, err);
                        setSlideImages(prev => ({ ...prev, [i]: "error" }));
                    }
                })
            );
            setAllGenerated(true);
        };

        generateAll();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDownload = (src, idx) => {
        if (!src || src === "loading" || src === "error") return;
        const a = document.createElement("a");
        a.href = src;
        a.download = `slide-${idx + 1}.png`;
        a.click();
    };

    const slide = slides[currentSlide];
    const imgState = slideImages[currentSlide];

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: "fixed", inset: 0, zIndex: 60,
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(6px)",
                    animation: "fadeIn 0.2s ease",
                }}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 61,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        pointerEvents: "all",
                        width: "100%",
                        maxWidth: "680px",
                        background: "linear-gradient(145deg, #13131f 0%, #1a1a30 100%)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "20px",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                        overflow: "hidden",
                        animation: "slideUpModal 0.3s cubic-bezier(0.34,1.4,0.64,1) both",
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "16px 20px 14px",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 16,
                            }}>🖼️</div>
                            <div>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>
                                    Generated Slides
                                </p>
                                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                                    {slides.length} slides · powered by Puter AI
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 8, width: 30, height: 30,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "rgba(255,255,255,0.5)",
                        }}>
                            <XIcon />
                        </button>
                    </div>

                    {/* Slide viewer */}
                    <div style={{ padding: "20px 20px 0" }}>
                        {/* Slide number strip */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    style={{
                                        flex: 1, height: 4, borderRadius: 4, border: "none", cursor: "pointer",
                                        background: i === currentSlide
                                            ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                                            : "rgba(255,255,255,0.12)",
                                        transition: "all 0.25s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Slide card */}
                        <div style={{
                            borderRadius: 14,
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.03)",
                            position: "relative",
                        }}>
                            {/* Image area */}
                            <div style={{
                                height: 240,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
                                position: "relative",
                                overflow: "hidden",
                            }}>
                                {imgState === "loading" && (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: "50%",
                                            border: "3px solid rgba(99,102,241,0.3)",
                                            borderTopColor: "#6366f1",
                                            animation: "spin 0.8s linear infinite",
                                        }} />
                                        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                                            Generating image…
                                        </p>
                                    </div>
                                )}
                                {imgState === "error" && (
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                                        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                                            Image generation failed
                                        </p>
                                    </div>
                                )}
                                {imgState && imgState !== "loading" && imgState !== "error" && (
                                    <img
                                        src={imgState}
                                        alt={`Slide ${currentSlide + 1}`}
                                        style={{
                                            width: "100%", height: "100%",
                                            objectFit: "cover",
                                            animation: "fadeIn 0.4s ease",
                                        }}
                                    />
                                )}

                                {/* Slide number badge */}
                                <div style={{
                                    position: "absolute", top: 10, left: 10,
                                    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                                    borderRadius: 6, padding: "2px 8px",
                                    fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                                    letterSpacing: "0.5px",
                                }}>
                                    {currentSlide + 1} / {slides.length}
                                </div>

                                {/* Download button */}
                                {imgState && imgState !== "loading" && imgState !== "error" && (
                                    <button
                                        onClick={() => handleDownload(imgState, currentSlide)}
                                        title="Download slide image"
                                        style={{
                                            position: "absolute", top: 10, right: 10,
                                            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: 6, padding: "4px 8px",
                                            display: "flex", alignItems: "center", gap: 4,
                                            cursor: "pointer", color: "rgba(255,255,255,0.75)",
                                            fontSize: 11,
                                        }}
                                    >
                                        <DownloadIcon /> Save
                                    </button>
                                )}
                            </div>

                            {/* Slide text */}
                            <div style={{ padding: "14px 18px 18px" }}>
                                <p style={{
                                    margin: "0 0 6px",
                                    fontSize: 13, fontWeight: 700, color: "#fff",
                                    letterSpacing: "-0.2px",
                                }}>
                                    {slide.title}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: 12, lineHeight: 1.6,
                                    color: "rgba(255,255,255,0.55)",
                                }}>
                                    {slide.body}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nav controls */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 20px 20px",
                    }}>
                        <button
                            onClick={() => setCurrentSlide(i => Math.max(0, i - 1))}
                            disabled={currentSlide === 0}
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 10, padding: "8px 16px",
                                display: "flex", alignItems: "center", gap: 6,
                                color: currentSlide === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                                fontSize: 12, fontWeight: 500, cursor: currentSlide === 0 ? "default" : "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            <ChevronLeftIcon /> Prev
                        </button>

                        <div style={{ display: "flex", gap: 6 }}>
                            {slides.map((_, i) => (
                                <div key={i} onClick={() => setCurrentSlide(i)} style={{
                                    width: i === currentSlide ? 20 : 6,
                                    height: 6, borderRadius: 3,
                                    background: i === currentSlide
                                        ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                                        : "rgba(255,255,255,0.2)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }} />
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentSlide(i => Math.min(slides.length - 1, i + 1))}
                            disabled={currentSlide === slides.length - 1}
                            style={{
                                background: currentSlide === slides.length - 1
                                    ? "rgba(255,255,255,0.06)"
                                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                border: "none",
                                borderRadius: 10, padding: "8px 16px",
                                display: "flex", alignItems: "center", gap: 6,
                                color: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.2)" : "#fff",
                                fontSize: 12, fontWeight: 500,
                                cursor: currentSlide === slides.length - 1 ? "default" : "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            Next <ChevronRightIcon />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUpModal {
                    0%   { opacity: 0; transform: translateY(24px) scale(0.97); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}

// ── Generate Video Modal ──────────────────────────────
function GenerateVideoModal({ msgId, responseText, messagePayload, onClose }) {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scenes, setScenes] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const animationRef = useRef(null);
    const startTimeRef = useRef(0);
    const pauseTimeRef = useRef(0);
    const totalDurationRef = useRef(0);

    // Fetch video JSON from webhook
    useEffect(() => {
        let isMounted = true;
        const fetchVideoData = async () => {
            try {
                const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_VIDEO;
                if (!webhookUrl) throw new Error("VITE_N8N_WEBHOOK_VIDEO is missing in .env");

                const res = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(messagePayload),
                });
                if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
                
                const data = await res.json();
                
                // --- Parse the nested payload format ---
                let parsedScenes = [];
                try {
                    // It might come wrapped in the array format like: [{ output: "```json\n..." }]
                    let rawOutputObj = data;
                    if (Array.isArray(data) && data.length > 0 && data[0].output) {
                        const outputStr = data[0].output.replace(/```json\n|\n```/g, '');
                        rawOutputObj = JSON.parse(outputStr);
                    }
                    if (rawOutputObj && rawOutputObj.video && Array.isArray(rawOutputObj.video.scenes)) {
                        parsedScenes = rawOutputObj.video.scenes;
                    } else if (Array.isArray(rawOutputObj.scenes)) {
                        parsedScenes = rawOutputObj.scenes;
                    }
                } catch (e) {
                    console.error("Error parsing video JSON structure:", e);
                }
                
                if (parsedScenes.length === 0) {
                     parsedScenes = [
                         { duration: 3, background: "#F8F9FA", elements: [{ type: "text", content: "Generating video based on text.", y: 220, fontSize: 32, color: "#1A1A2E" }] },
                     ];
                }
                
                if (isMounted) {
                    setScenes(parsedScenes);
                    // durations are seemingly in seconds in the new structure
                    totalDurationRef.current = parsedScenes.reduce((acc, s) => acc + ((s.duration || 3) * 1000), 0);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Video webhook error:", err);
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };
        fetchVideoData();
        return () => { isMounted = false; };
    }, [messagePayload, responseText]);

    // Canvas Render Loop
    const renderFrame = useCallback((timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        let elapsed = timestamp - startTimeRef.current;
        
        if (elapsed >= totalDurationRef.current) {
            setIsPlaying(false);
            setProgress(100);
            return;
        }

        setProgress((elapsed / totalDurationRef.current) * 100);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        let currentScene = scenes[0];
        let sceneStart = 0;
        let runningTime = 0;
        for (const scene of scenes) {
            const d = (scene.duration || 3) * 1000;
            if (elapsed >= runningTime && elapsed < runningTime + d) {
                currentScene = scene;
                sceneStart = runningTime;
                break;
            }
            runningTime += d;
        }

        const sceneElapsed = elapsed - sceneStart;
        const sceneDur = (currentScene.duration || 3) * 1000;
        const sceneProgress = sceneElapsed / sceneDur;

        // Clear Background
        ctx.fillStyle = currentScene.background || "#F8F9FA";
        ctx.fillRect(0, 0, width, height);

        // Abstract Background graphics
        const baseColor = "#6366f1";
        ctx.beginPath();
        ctx.arc(width/2, height/2, 100 + Math.sin(sceneProgress * Math.PI) * 200, 0, 2*Math.PI);
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = 0.05 + 0.05 * Math.sin(sceneProgress * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Render Elements
        const elements = currentScene.elements || [];
        for (const el of elements) {
            if (el.type === "text") {
                const elDelay = (el.animation?.delay || 0) * 1000;
                const elDur = (el.animation?.duration || 0.5) * 1000;
                
                let elAlpha = 0;
                if (sceneElapsed > elDelay) {
                    elAlpha = Math.min(1, (sceneElapsed - elDelay) / elDur);
                }

                if (elAlpha > 0) {
                    ctx.globalAlpha = elAlpha;
                    
                    // Handle Slide animation Y offset
                    let yOffset = 0;
                    if (el.animation?.type === "slide" && el.animation?.direction === "up") {
                         yOffset = 30 * (1 - elAlpha);
                    }

                    ctx.fillStyle = el.color || "#1A1A2E";
                    const fw = el.fontWeight === "bold" ? "bold" : "normal";
                    const fs = el.fontSize || 24;
                    ctx.font = `${fw} ${fs}px sans-serif`;
                    ctx.textAlign = el.x === "center" ? "center" : "left";
                    ctx.textBaseline = "middle";
                    
                    const drawX = el.x === "center" ? width / 2 : (el.x || 50);
                    let drawY = (el.y || height / 2) + yOffset;

                    // Text wrapping
                    const maxLineWidth = el.maxWidth || width * 0.8;
                    const words = (el.content || "").split(" ");
                    let line = "";
                    
                    for (let n = 0; n < words.length; n++) {
                        const testLine = line + words[n] + " ";
                        const metrics = ctx.measureText(testLine);
                        if (metrics.width > maxLineWidth && n > 0) {
                            ctx.fillText(line.trim(), drawX, drawY);
                            line = words[n] + " ";
                            drawY += fs * 1.4;
                        } else {
                            line = testLine;
                        }
                    }
                    ctx.fillText(line.trim(), drawX, drawY);
                    
                    ctx.globalAlpha = 1;
                }
            } else if (el.type === "diagram") {
                const elDelay = (el.animation?.delay || 0) * 1000;
                const elDur = (el.animation?.duration || 0.5) * 1000;
                
                let elScale = 0;
                if (sceneElapsed > elDelay) {
                    elScale = Math.min(1, (sceneElapsed - elDelay) / elDur);
                }

                if (elScale > 0) {
                    const rectW = el.width || 400;
                    const rectH = el.height || 150;
                    const drawX = el.x === "center" ? width / 2 : (el.x || 50);
                    const drawY = el.y || 400;

                    ctx.save();
                    ctx.translate(drawX, drawY);
                    ctx.scale(elScale, elScale);
                    
                    // Box
                    ctx.fillStyle = "rgba(99, 102, 241, 0.1)";
                    ctx.strokeStyle = "#8b5cf6";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(-rectW/2, -rectH/2, rectW, rectH, 12);
                    ctx.fill();
                    ctx.stroke();

                    // Label
                    ctx.fillStyle = "#8b5cf6";
                    ctx.font = "italic 18px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(el.label || "Diagram", 0, 0);

                    ctx.restore();
                }
            }
        }

        if (isPlaying) {
            animationRef.current = requestAnimationFrame(renderFrame);
        }
    }, [isPlaying, scenes]);

    useEffect(() => {
        if (isPlaying && !loading && !error && scenes.length > 0) {
            if (progress >= 100) {
                startTimeRef.current = 0;
            } else if (pauseTimeRef.current) {
                startTimeRef.current += performance.now() - pauseTimeRef.current;
                pauseTimeRef.current = 0;
            }
            animationRef.current = requestAnimationFrame(renderFrame);
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            pauseTimeRef.current = performance.now();
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying, loading, error, scenes, progress, renderFrame]);

    useEffect(() => {
        if (!loading && !error && scenes.length > 0 && !isPlaying && progress === 0) {
           const setupDraw = (t) => {
               startTimeRef.current = t;
               renderFrame(t); 
               setIsPlaying(false);
           };
           requestAnimationFrame(setupDraw);
        }
    }, [loading, error, scenes, isPlaying, progress, renderFrame]);

    // Provide the actual VideoIcon svg inline since it's locally scoped above
    const LocalVideoIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    );

    const LocalXIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );

    return (
        <>
            <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", animation: "fadeIn 0.2s ease" }} onClick={onClose} />
            <div style={{ position: "fixed", inset: 0, zIndex: 61, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", pointerEvents: "none" }}>
                <div style={{ pointerEvents: "all", width: "100%", maxWidth: "800px", background: "#0f0f13", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", animation: "popIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff", fontWeight: 600 }}>
                            <LocalVideoIcon /> Generated Video
                        </div>
                        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}><LocalXIcon /></button>
                    </div>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
                        {loading && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)" }}>
                                <div style={{ width: 40, height: 40, border: "3px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                                <div style={{ marginTop: 16 }}>Generating animation...</div>
                            </div>
                        )}
                        {error && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                                Error: {error}
                            </div>
                        )}
                        <canvas ref={canvasRef} width={1280} height={720} style={{ width: "100%", height: "100%", opacity: loading || error ? 0 : 1 }} />
                    </div>
                    {!loading && !error && (
                        <div style={{ padding: "16px", background: "#181820" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: "#6366f1", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}>
                                    {isPlaying ? <span style={{fontSize:'12px',fontWeight:'bold'}}>||</span> : <span style={{fontSize:'14px',marginLeft:'4px'}}>▶</span>}
                                </button>
                                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, cursor: "pointer", position: "relative" }}>
                                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, background: "#8b5cf6", borderRadius: 3, transition: isPlaying ? "none" : "width 0.1s" }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

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



export default function ChatPanel({ style, bookTitle = "English-Textbook 5th SSC Maharashtra Board", pageNumber = 0, chapterTitle = "" }) {
    const [messages, setMessages] = useState(DEMO_MESSAGES);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [popChip, setPopChip] = useState(null);       // which chip triggered the pop card
    const [speakingMsgId, setSpeakingMsgId] = useState(null); // which msg is being read aloud
    const [slidesForMsgId, setSlidesForMsgId] = useState(null); // which msg opened slides modal
    const [videoForMsg, setVideoForMsg] = useState(null); // which msg opened video modal
    const currentAudioRef = useRef(null);
    const chatScrollRef = useRef(null);
    const textareaRef = useRef(null);

    // ── Read Aloud via Puter.js TTS ────────────────────
    const handleReadAloud = async (msgId, text) => {
        if (speakingMsgId === msgId) {
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
                currentAudioRef.current = null;
            }
            setSpeakingMsgId(null);
            return;
        }

        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }

        try {
            setSpeakingMsgId(msgId);
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
                    chapterTitle,
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

    // Find the message whose slides modal is open
    const slidesMsg = slidesForMsgId
        ? messages.find(m => m.id === slidesForMsgId)
        : null;

    return (
        <>
            {/* ── Generate Slides Modal ────────────────── */}
            {slidesMsg && (
                <GenerateSlidesModal
                    msgId={slidesMsg.id}
                    responseText={slidesMsg.response}
                    onClose={() => setSlidesForMsgId(null)}
                />
            )}

            {/* ── Generate Video Modal ─────────────────── */}
            {videoForMsg && (
                <GenerateVideoModal
                    msgId={videoForMsg.id}
                    responseText={videoForMsg.response}
                    messagePayload={videoForMsg.payload}
                    onClose={() => setVideoForMsg(null)}
                />
            )}

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

                                                {/* ── Action buttons row (always shown for AI) ── */}
                                                <div className="flex items-center gap-1.5 flex-wrap">

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

                                                    {/* ── Generate Slides Button (every AI message) ── */}
                                                    <button
                                                        onClick={() => setSlidesForMsgId(msg.id)}
                                                        title="Generate slides from this response"
                                                        className="gen-slides-btn"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '3px 8px',
                                                            borderRadius: '6px',
                                                            border: '1px solid rgba(99,102,241,0.3)',
                                                            background: slidesForMsgId === msg.id
                                                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                                                : 'rgba(99,102,241,0.08)',
                                                            color: slidesForMsgId === msg.id
                                                                ? '#fff'
                                                                : '#818cf8',
                                                            fontSize: '11px',
                                                            fontWeight: 500,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        <SlidesIcon />
                                                        <span>Slides</span>
                                                    </button>

                                                    {/* ── Generate Video Button (every AI message) ── */}
                                                    <button
                                                        onClick={() => setVideoForMsg({
                                                            id: msg.id,
                                                            response: msg.response,
                                                            payload: {
                                                                message: msg.response,
                                                                bookTitle,
                                                                pageNumber,
                                                                chapterTitle,
                                                            }
                                                        })}
                                                        title="Generate video from this response"
                                                        className="gen-video-btn"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '3px 8px',
                                                            borderRadius: '6px',
                                                            border: '1px solid rgba(236,72,153,0.3)',
                                                            background: videoForMsg?.id === msg.id
                                                                ? 'linear-gradient(135deg, #ec4899, #f43f5e)'
                                                                : 'rgba(236,72,153,0.08)',
                                                            color: videoForMsg?.id === msg.id
                                                                ? '#fff'
                                                                : '#f472b6',
                                                            fontSize: '11px',
                                                            fontWeight: 500,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        <VideoIcon />
                                                        <span>Video</span>
                                                    </button>


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

                {/* Animations */}
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
                    .gen-slides-btn:hover {
                        background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
                        color: #fff !important;
                        border-color: transparent !important;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(99,102,241,0.35);
                    }
                    .gen-video-btn:hover {
                        background: linear-gradient(135deg, #ec4899, #f43f5e) !important;
                        color: #fff !important;
                        border-color: transparent !important;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(236,72,153,0.35);
                    }
                `}</style>
            </section>
        </>
    );
}