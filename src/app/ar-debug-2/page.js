'use client';

import { useState, useEffect, useRef } from 'react';

export default function ARDebug2Page() {
    const [currentScene, setCurrentScene] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [logs, setLogs] = useState([]);
    const modelViewerRef = useRef(null);

    // Load model-viewer component on client side only
    useEffect(() => {
        import('@google/model-viewer').catch(console.error);
    }, []);

    const scenes = [
        {
            model: '/models/rumahgadang.glb',
            script: 'Rumah Gadang adalah rumah adat Minangkabau yang khas dengan atapnya yang melengkung seperti tanduk kerbau.',
            scale: '0.3 0.3 0.3'
        },
        {
            model: '/models/crown.glb',
            script: 'Seiring waktu, perahu jalur menjadi tongkang kerajaan yang megah untuk para bangsawan dan raja.',
            scale: '0.4 0.4 0.4'
        },
        {
            model: '/models/globe.glb',
            script: 'Setelah kemerdekaan Indonesia, Pacu Jalur menjadi festival rakyat untuk merayakan Hari Kemerdekaan Republik Indonesia.',
            scale: '0.5 0.5 0.5'
        }
    ];

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    };

    const handleNextModel = () => {
        const nextScene = (currentScene + 1) % scenes.length;
        setCurrentScene(nextScene);
        addLog(`Switched to scene ${nextScene + 1}: ${scenes[nextScene].model}`);
    };

    const speakText = (text) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        // Speak script when scene changes
        speakText(scenes[currentScene].script);
    }, [currentScene]);

    return (
        <div className="w-full h-screen bg-gray-100 relative overflow-hidden">
            <model-viewer
                src={scenes[currentScene].model}
                ios-src=""
                alt="A 3D model"
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '100%' }}
                ref={modelViewerRef}
            >
                <button
                    slot="ar-button"
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        border: 'none',
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '8px 16px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                        cursor: 'pointer',
                        zIndex: 100
                    }}
                >
                    👋 Activate AR
                </button>

                <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 pointer-events-none">
                    {/* UI Overlay */}
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-md mx-4 pointer-events-auto text-center">
                        <p className="text-lg text-gray-800 mb-4">{scenes[currentScene].script}</p>
                        <button
                            onClick={handleNextModel}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                        >
                            NEXT MODEL
                        </button>
                    </div>
                </div>
            </model-viewer>

            {/* Logs Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 text-green-400 p-4 rounded-lg max-w-xs max-h-48 overflow-y-auto text-xs font-mono pointer-events-none z-50">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
}
