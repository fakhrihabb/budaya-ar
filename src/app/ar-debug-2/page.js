'use client';

import { useState, useEffect, useRef } from 'react';

export default function ARDebug2Page() {
    const [currentScene, setCurrentScene] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [logs, setLogs] = useState([]);
    const [arSupported, setArSupported] = useState(false);
    const [arEnabled, setArEnabled] = useState(false);
    const [isInAR, setIsInAR] = useState(false);
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

    // Handle AR state changes
    useEffect(() => {
        const handleARStateChange = (event) => {
            const isARActive = event.detail.isAR;
            setIsInAR(isARActive);
            setArEnabled(isARActive);
        };

        const modelViewer = modelViewerRef.current;
        if (modelViewer) {
            modelViewer.addEventListener('ar-status', handleARStateChange);
        }

        return () => {
            if (modelViewer) {
                modelViewer.removeEventListener('ar-status', handleARStateChange);
            }
        };
    }, [modelViewerRef]);

    const scenes = [
        {
            model: '/models/rumahgadang.glb',
            script: 'Rumah Gadang adalah rumah adat Minangkabau yang khas dengan atapnya yang melengkung seperti tanduk kerbau.',
            scale: '1 1 1',
            title: 'Rumah Gadang'
        },
        {
            model: '/models/banana.glb',
            script: 'Jalur digunakan untuk mengangkut hasil bumi seperti buah-buahan lokal dan tebu ke hilir sungai.',
            scale: '0.3 0.3 0.3',
            title: 'Pacu Jalur'
        },
        {
            model: '/models/cartoon_crocodile_croco-roco.glb',
            script: 'Perahu memanjang ini dihias dengan ornamen kepala buaya atau ular, melambangkan budaya setempat.',
            scale: '0.3 0.3 0.3',
            title: 'Perahu Buaya'
        }
    ];

    // Generate dynamic title based on scene content
    const getSceneTitle = (scene) => {
        return scene.title || '3D Model View';
    };

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

        /* Hide default AR button and force custom styling */
        model-viewer #ar-button {
          display: none !important;
        }

        /* Custom AR toggle button styling */
        .ar-toggle-button {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 1000;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(30, 30, 40, 0.4) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease-out;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: fade-in 0.8s ease-out forwards;
        }

        /* Dynamic scene title styling */
        .scene-title {
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1000;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(30, 30, 40, 0.4) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease-out;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: fade-in 0.8s ease-out forwards;
        }

        .scene-title-glow {
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(100, 200, 255, 0.1) 0%, transparent 70%);
          filter: blur(3px);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        /* Adjust model-viewer positioning for better visibility */
        model-viewer {
          transition: transform 0.3s ease-out;
        }

        .ar-toggle-button:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(6, 182, 212, 0.2);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(6, 182, 212, 0.4) 100%);
        }

        .ar-toggle-button:active {
          transform: scale(0.95);
        }

        .ar-toggle-button svg {
          width: 20px;
          height: 20px;
        }

        .ar-toggle-button span {
          color: white;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .ar-toggle-button.ar-active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(6, 182, 212, 0.4) 100%);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(6, 182, 212, 0.2);
        }

        .ar-toggle-button.ar-active span {
          color: #e0f2fe;
        }

        @media (max-width: 640px) {
          .ar-toggle-button {
            padding: 8px 12px;
            gap: 8px;
            top: 12px;
            right: 12px;
          }
          
          .ar-toggle-button span {
            font-size: 12px;
          }

          .scene-title {
            padding: 8px 12px;
            gap: 8px;
            top: 12px;
            left: 12px;
          }

          .scene-title span {
            font-size: 14px;
          }

          /* Responsive subtitle positioning */
          @media (max-width: 640px) {
            .subtitle-container {
              bottom: 24px !important;
              padding: 12px !important;
            }
          }

          @media (max-width: 480px) {
            .subtitle-container {
              bottom: 16px !important;
              padding: 8px !important;
            }
          }

          @media (max-width: 480px) {
            .scene-title {
              padding: 6px 8px;
              gap: 6px;
              top: 8px;
              left: 8px;
            }

            .scene-title span {
              font-size: 12px;
            }
          }
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
                <button slot="ar-button" id="ar-button" style={{ display: 'none' }}>
                    View in your space
                </button>

                <div
                    className={`
                        absolute left-0 right-0 flex flex-col items-center gap-4 pointer-events-none
                        transition-all duration-300 ease-out
                        ${isInAR ? 'bottom-32' : 'bottom-48'}
                    `}
                >
                    {/* HUD-style Subtitle Container */}
                    <div
                        className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl shadow-2xl max-w-md mx-4 pointer-events-auto flex items-center gap-4 border border-white/10 animate-fade-in-once subtitle-container"
                        style={{
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(30, 30, 40, 0.4) 100%)',
                            marginBottom: isInAR ? '60px' : '0px',
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

            {/* Dynamic Scene Title - Top Left Corner */}
            <div className="scene-title">
                <span
                    style={{
                        color: 'white',
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: '16px',
                        fontWeight: '500',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {getSceneTitle(scenes[currentScene])}
                </span>
                {/* Subtle glow effect */}
                <div className="scene-title-glow" />
            </div>

            {/* AR Toggle Button - Top Right Corner */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={() => {
                        if (modelViewerRef.current && arSupported) {
                            setArEnabled(!arEnabled);
                            if (!arEnabled) {
                                modelViewerRef.current.activateAR();
                            }
                        }
                    }}
                    disabled={!arSupported}
                    className={`
                        bg-black/40 backdrop-blur-xl p-3 rounded-2xl shadow-2xl
                        border border-white/10 animate-fade-in-once
                        transition-all duration-300 ease-out
                        flex items-center gap-3
                        ${arEnabled ? 'bg-gradient-to-r from-blue-600/50 to-cyan-600/50' : ''}
                        ${!arSupported ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                        md:p-4 sm:p-2 xs:p-1.5
                    `}
                    style={{
                        boxShadow: arEnabled
                            ? '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(6, 182, 212, 0.2)'
                            : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        background: arEnabled
                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(6, 182, 212, 0.4) 100%)'
                            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(30, 30, 40, 0.4) 100%)',
                    }}
                    aria-label={arEnabled ? 'Disable AR mode' : 'Enable AR mode'}
                    title={arEnabled ? 'Disable AR mode' : 'Enable AR mode'}
                >
                    {/* AR Icon */}
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={arEnabled ? 'text-cyan-300' : 'text-white'}
                    >
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 8h-4v-1h4v1zm0-2h-4V7h4v1z"
                            fill="currentColor"
                        />
                        <circle cx="12" cy="9" r="2" fill="currentColor" opacity="0.3"/>
                    </svg>
                    
                    {/* Status Text - Responsive */}
                    <span
                        className={`
                            text-sm md:text-base font-medium
                            ${arEnabled ? 'text-cyan-100' : 'text-white'}
                            xs:hidden sm:inline
                        `}
                        style={{
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        {arEnabled ? 'AR ON' : 'AR OFF'}
                    </span>
                    
                    {/* Mobile-only indicator */}
                    <span
                        className={`
                            text-xs font-medium
                            ${arEnabled ? 'text-cyan-100' : 'text-white'}
                            xs:inline sm:hidden
                        `}
                        style={{
                            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                    >
                        {arEnabled ? 'ON' : 'OFF'}
                    </span>
                    
                    {/* Glowing effect when enabled */}
                    {arEnabled && (
                        <div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                                filter: 'blur(4px)',
                                mixBlendMode: 'screen',
                            }}
                        />
                    )}
                </button>
            </div>

            {/* Custom AR Exit Button - Only visible when in AR mode */}
            {isInAR && (
                <button
                    className="custom-ar-exit-button"
                    onClick={() => {
                        if (modelViewerRef.current) {
                            modelViewerRef.current.exitAR();
                            setIsInAR(false);
                            setArEnabled(false);
                        }
                    }}
                    aria-label="Exit AR mode"
                    title="Exit AR mode"
                >
                    {/* Exit AR Icon */}
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                            fill="white"
                        />
                    </svg>
                    
                    {/* Exit Text */}
                    <span>Exit AR</span>
                </button>
            )}

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
