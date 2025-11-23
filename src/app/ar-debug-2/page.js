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
                addLog('✅ Model-viewer loaded');

                // Wait for the component to be defined
                if (window.customElements) {
                    await window.customElements.whenDefined('model-viewer');
                    addLog('✅ Model-viewer custom element defined');
                }

                // Check AR support
                setTimeout(() => {
                    if (modelViewerRef.current) {
                        const canActivateAR = modelViewerRef.current.canActivateAR;
                        addLog(`AR Support: ${canActivateAR ? 'YES ✅' : 'NO ❌'}`);
                        setArSupported(canActivateAR);
                    }
                }, 1000);
            } catch (error) {
                addLog(`❌ Error loading model-viewer: ${error.message}`);
            }
        };

        loadModelViewer();
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
                style={{ width: '100%', height: '100%' }}
                ref={modelViewerRef}
                onLoad={() => addLog('Model loaded')}
            >
                <button slot="ar-button" id="ar-button">
                    View in your space
                </button>

                <div
                    className="absolute left-0 right-0 flex flex-col items-center gap-4 pointer-events-none"
                    style={{ bottom: '200px' }}
                >
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

            {/* Debug info */}
            <div className="absolute top-16 right-4 bg-yellow-500 text-black p-2 rounded text-xs z-50">
                AR: {arSupported ? '✅' : '❌'}
            </div>

            {/* Logs Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 text-green-400 p-4 rounded-lg max-w-xs max-h-48 overflow-y-auto text-xs font-mono pointer-events-none z-50">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
}
