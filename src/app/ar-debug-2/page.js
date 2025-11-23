'use client';

import { useState, useEffect, useRef } from 'react';

export default function ARDebug2Page() {
    const [currentScene, setCurrentScene] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [logs, setLogs] = useState([]);
    const [arSupported, setArSupported] = useState(false);
    const modelViewerRef = useRef(null);

    // Load model-viewer component on client side only
    useEffect(() => {
        const loadModelViewer = async () => {
            try {
                await import('@google/model-viewer');
                // addLog('✅ Model-viewer loaded');

                // Wait for the component to be defined
                if (window.customElements) {
                    await window.customElements.whenDefined('model-viewer');
                    // addLog('✅ Model-viewer custom element defined');
                }

                // Check AR support
                setTimeout(() => {
                    if (modelViewerRef.current) {
                        const canActivateAR = modelViewerRef.current.canActivateAR;
                        // addLog(`AR Support: ${canActivateAR ? 'YES ✅' : 'NO ❌'}`);
                        setArSupported(canActivateAR);
                    }
                }, 1000);
            } catch (error) {
                // addLog(`❌ Error loading model-viewer: ${error.message}`);
                // Error handling remains intact but debug output is disabled
            }
        };

        loadModelViewer();
    }, []);

    const scenes = [
        {
            model: '/models/rumahgadang.glb',
            script: 'Rumah Gadang adalah rumah adat Minangkabau yang khas dengan atapnya yang melengkung seperti tanduk kerbau.',
            scale: '1 1 1'
        },
        {
            model: '/models/banana.glb',
            script: 'Jalur digunakan untuk mengangkut hasil bumi seperti buah-buahan lokal dan tebu ke hilir sungai.',
            scale: '0.3 0.3 0.3'
        },
        {
            model: '/models/cartoon_crocodile_croco-roco.glb',
            script: 'Perahu memanjang ini dihias dengan ornamen kepala buaya atau ular, melambangkan budaya setempat.',
            scale: '0.3 0.3 0.3'
        }
    ];

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    };

    const handleNextModel = () => {
        const nextScene = (currentScene + 1) % scenes.length;
        setCurrentScene(nextScene);
        // addLog(`Switched to scene ${nextScene + 1}: ${scenes[nextScene].model}`);
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
            <style jsx global>{`
        model-viewer {
          background-color: #eee;
          overflow-x: hidden;
        }

        model-viewer #ar-button {
          background-color: #fff;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          bottom: 132px;
          padding: 0px 16px;
          font-family: Roboto Regular, Helvetica Neue, sans-serif;
          font-size: 14px;
          color: #4285f4;
          height: 36px;
          line-height: 36px;
          border-radius: 18px;
          border: 1px solid #DADCE0;
        }

        model-viewer #ar-button:active {
          background-color: #E8EAED;
        }

        model-viewer #ar-button:focus {
          outline: none;
        }

        model-viewer #ar-button:focus-visible {
          outline: 1px solid #4285f4;
        }
      `}</style>

            <model-viewer
                src={scenes[currentScene].model}
                ios-src=""
                alt="A 3D model"
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1"                           // ADD THIS
                scale={scenes[currentScene].scale}      // ADD THIS
                style={{ width: '100%', height: '100%' }}
                ref={modelViewerRef}
                // onLoad={() => addLog('Model loaded')}
            >
                <button slot="ar-button" id="ar-button">
                    View in your space
                </button>

                <div
                    className="absolute left-0 right-0 flex flex-col items-center gap-4 pointer-events-none"
                    style={{ bottom: '200px' }}
                >
                    {/* HUD-style Subtitle Container */}
                    <div
                        className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl shadow-2xl max-w-md mx-4 pointer-events-auto flex items-center gap-4 border border-white/10 animate-fade-in-once"
                        style={{
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(30, 30, 40, 0.4) 100%)',
                        }}
                    >
                        {/* Avatar with glowing border */}
                        <div
                            className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                            style={{
                                boxShadow: '0 0 20px rgba(100, 200, 255, 0.6), 0 0 40px rgba(100, 200, 255, 0.3)',
                                border: '2px solid rgba(100, 200, 255, 0.8)',
                            }}
                        >
                            <img
                                src="/apple-touch-icon.png"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                            {/* Glowing ring effect */}
                            <div
                                className="absolute inset-0 rounded-full pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle at 30% 30%, rgba(100, 200, 255, 0.8) 0%, transparent 70%)',
                                    filter: 'blur(2px)',
                                    mixBlendMode: 'screen',
                                }}
                            />
                        </div>
                        
                        {/* Subtitle text and button container */}
                        <div className="flex-1">
                            <p
                                className="text-white text-base font-medium leading-relaxed mb-3"
                                style={{
                                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                }}
                            >
                                {scenes[currentScene].script}
                            </p>
                            <button
                                onClick={handleNextModel}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm"
                                style={{
                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
                                }}
                            >
                                NEXT MODEL
                            </button>
                        </div>
                    </div>
                </div>
            </model-viewer>

            {/* Debug info - Disabled */}
            {/* <div className="absolute top-16 right-4 bg-yellow-500 text-black p-2 rounded text-xs z-50">
                AR: {arSupported ? '✅' : '❌'}
            </div> */}

            {/* Logs Overlay - Disabled */}
            {/* <div className="absolute top-4 left-4 bg-black/80 text-green-400 p-4 rounded-lg max-w-xs max-h-48 overflow-y-auto text-xs font-mono pointer-events-none z-50">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div> */}
        </div>
    );
}
