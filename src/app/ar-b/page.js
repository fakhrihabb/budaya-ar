'use client';

import { useState, useEffect, useRef } from 'react';

export default function ARBPage() {
  const [arSupported, setArSupported] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [currentScene, setCurrentScene] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [logs, setLogs] = useState([]);

  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const xrSessionRef = useRef(null);
  const hitTestSourceRef = useRef(null);
  const reticleRef = useRef(null);
  const placedModelRef = useRef(null);
  const controllerRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const autoPlayRef = useRef(false); // Ref to track autoPlay state for callbacks

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-20), logMessage]); // Keep last 20 logs
    console.log(message);
  };

  // Scenes with models and scripts
  const scenes = [
    {
      model: '/models/cartoon_crocodile_croco-roco.glb',
      script: 'In ancient Indonesian waters, crocodiles were revered as sacred creatures, symbolizing strength and protection.',
      scale: 0.3,
      name: 'Sacred Crocodile'
    },
    {
      model: '/models/banana.glb',
      script: 'Bananas have been cultivated in Indonesia for thousands of years as a staple food, providing nutrition to generations.',
      scale: 0.5,
      name: 'Ancient Banana'
    }
  ];

  // Text-to-speech function with ref to get latest state
  const speakText = (text, sceneIndex) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      addLog('⚠️ Speech synthesis not supported');
      return;
    }

    addLog(`🔊 Starting speech for scene ${sceneIndex + 1}`);

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      addLog(`✅ Speech started for scene ${sceneIndex + 1}`);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      addLog(`🔇 Speech ended for scene ${sceneIndex + 1}`);
      addLog(`AutoPlay: ${autoPlayRef.current ? 'ENABLED' : 'DISABLED'}`);

      // Check if auto-play is still enabled using ref
      if (autoPlayRef.current && sceneIndex < scenes.length - 1) {
        addLog('✅ Scheduling next scene in 5 seconds...');

        // Clear any existing timer
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
        }

        // Schedule next scene
        autoPlayTimerRef.current = setTimeout(() => {
          addLog('⏰ Timer fired! Switching to next scene...');
          nextScene();
        }, 5000);
      } else if (sceneIndex >= scenes.length - 1) {
        // Last scene, stop auto-play
        addLog('📍 Last scene, stopping auto-play');
        setAutoPlay(false);
        autoPlayRef.current = false;
      } else {
        addLog('⏹️ Auto-play disabled, not scheduling');
      }
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      addLog('❌ Speech error: ' + event.error);
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Check WebXR support
  useEffect(() => {
    addLog('🔍 Checking WebXR support...');

    const checkSupport = async () => {
      setStatusMessage('Checking WebXR support...');

      if (!navigator.xr) {
        addLog('❌ WebXR not available');
        setStatusMessage('WebXR not available');
        setArSupported(false);
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        setArSupported(supported);
        setStatusMessage(supported ? 'WebXR AR supported!' : 'WebXR AR not supported');
        addLog(supported ? '✅ WebXR AR supported!' : '❌ WebXR AR not supported');
      } catch (e) {
        addLog('❌ Error checking support: ' + e.message);
        setArSupported(false);
        setStatusMessage('Error checking WebXR support');
      }
    };

    checkSupport();
  }, []);

  // Initialize Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = async () => {
      try {
        const THREE = await import('three');

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;

        // Set reference space type to 'local'
        if (renderer.xr.setReferenceSpaceType) {
          renderer.xr.setReferenceSpaceType('local');
        }

        // Add lighting
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 1);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // Create reticle
        const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
        const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add(reticle);
        reticleRef.current = reticle;

        rendererRef.current = { THREE, renderer, scene, camera };

        renderer.setAnimationLoop((timestamp, frame) => {
          // Handle hit testing in AR mode
          if (frame && xrSessionRef.current) {
            const referenceSpace = renderer.xr.getReferenceSpace();
            const reticle = reticleRef.current;

            // Perform hit test to find surfaces
            if (hitTestSourceRef.current && referenceSpace && reticle) {
              const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
              if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(referenceSpace);
                reticle.visible = true;
                reticle.matrix.fromArray(pose.transform.matrix);
              } else {
                reticle.visible = false;
              }
            }

            // Auto-rotate placed model
            if (placedModelRef.current) {
              placedModelRef.current.rotation.y += 0.01;
            }
          }

          renderer.render(scene, camera);
        });

        setStatusMessage('Ready for AR');

      } catch (error) {
        console.error('Error initializing Three.js:', error);
        setStatusMessage('Error initializing 3D engine');
      }
    };

    init();

    return () => {
      if (rendererRef.current?.renderer) {
        rendererRef.current.renderer.setAnimationLoop(null);
      }
    };
  }, []);

  // Load model for specific scene index
  const loadModelForScene = async (sceneIndex) => {
    try {
      const scene = scenes[sceneIndex];
      addLog(`🔧 Loading ${scene.name} from ${scene.model}...`);

      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      const modelUrl = window.location.origin + scene.model;
      addLog(`📡 Model URL: ${modelUrl}`);

      return new Promise((resolve, reject) => {
        loader.load(
          modelUrl,
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(scene.scale, scene.scale, scene.scale);
            addLog(`✅ ${scene.name} GLB loaded successfully!`);
            resolve(model);
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percent = (progress.loaded / progress.total * 100).toFixed(0);
              addLog(`⏳ Loading ${scene.name}: ${percent}%`);
            }
          },
          (error) => {
            addLog(`❌ Error loading ${scene.name}: ${error.message}`);
            reject(error);
          }
        );
      });
    } catch (e) {
      addLog(`❌ Error setting up loader: ${e.message}`);
      throw e;
    }
  };

  // Switch to next scene
  const nextScene = async () => {
    if (currentScene < scenes.length - 1) {
      const newScene = currentScene + 1;
      addLog(`➡️ Switching to scene ${newScene + 1}: ${scenes[newScene].name}`);
      setCurrentScene(newScene);

      // Load new model if in AR
      if (sessionActive && rendererRef.current) {
        try {
          addLog(`📦 Loading ${scenes[newScene].name}...`);
          const model = await loadModelForScene(newScene);
          rendererRef.current.loadedModel = model;
          addLog(`✅ Model loaded into memory`);

          // If there's already a placed model, automatically replace it
          if (placedModelRef.current) {
            addLog(`🔄 Auto-replacing model... (old pos: ${placedModelRef.current.position.x.toFixed(2)}, ${placedModelRef.current.position.y.toFixed(2)}, ${placedModelRef.current.position.z.toFixed(2)})`);

            // Save old position
            const oldPosition = placedModelRef.current.position.clone();

            // Remove old model
            rendererRef.current.scene.remove(placedModelRef.current);
            addLog(`🗑️ Old model removed from scene`);

            // Place new model at same position as old one
            const newPlacedModel = model.clone();
            newPlacedModel.position.copy(oldPosition);
            rendererRef.current.scene.add(newPlacedModel);
            placedModelRef.current = newPlacedModel;

            addLog(`✅ ${scenes[newScene].name} placed at (${oldPosition.x.toFixed(2)}, ${oldPosition.y.toFixed(2)}, ${oldPosition.z.toFixed(2)})`);
          } else {
            addLog(`⚠️ No model placed yet (tap to place)`);
          }
        } catch (e) {
          addLog(`❌ Failed to load: ${e.message}`);
        }
      } else {
        addLog(`⚠️ Not in AR session, skipping model load`);
      }

      // Speak new scene script
      speakText(scenes[newScene].script, newScene);
    } else {
      addLog('📍 Last scene reached');
      setAutoPlay(false);
      autoPlayRef.current = false;
    }
  };

  // Handle auto-play toggle
  const toggleAutoPlay = () => {
    const newAutoPlay = !autoPlay;
    addLog(`🎮 Auto-play: ${newAutoPlay ? 'ON' : 'OFF'}`);
    setAutoPlay(newAutoPlay);
    autoPlayRef.current = newAutoPlay; // Sync ref

    if (!newAutoPlay) {
      // Stop auto-play - clear any pending timer
      if (autoPlayTimerRef.current) {
        addLog('⏹️ Clearing timer');
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    } else {
      addLog('▶️ Auto-play enabled');
    }
  };

  // Switch to previous scene
  const prevScene = async () => {
    if (currentScene > 0) {
      // Stop auto-play when manually going back
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      setAutoPlay(false);
      autoPlayRef.current = false; // Sync ref

      const newScene = currentScene - 1;
      setCurrentScene(newScene);
      console.log(`⬅️ Switching to scene ${newScene + 1}: ${scenes[newScene].name}`);

      // Load new model if in AR
      if (sessionActive && rendererRef.current) {
        try {
          console.log(`📦 Loading model for ${scenes[newScene].name}...`);
          const model = await loadModelForScene(newScene);
          rendererRef.current.loadedModel = model;
          console.log(`✅ Model loaded`);

          // If there's already a placed model, automatically replace it
          if (placedModelRef.current && reticleRef.current) {
            console.log('🔄 Auto-replacing placed model...');

            // Remove old model
            rendererRef.current.scene.remove(placedModelRef.current);

            // Place new model at same position as old one
            const newPlacedModel = model.clone();
            newPlacedModel.position.copy(placedModelRef.current.position);
            rendererRef.current.scene.add(newPlacedModel);
            placedModelRef.current = newPlacedModel;

            console.log(`✅ Model auto-replaced with ${scenes[newScene].name}`);
          } else {
            console.log(`✅ Model ready to place (tap screen)`);
          }
        } catch (e) {
          console.error(`❌ Failed to load ${scenes[newScene].name}:`, e);
        }
      }

      // Speak new scene script
      speakText(scenes[newScene].script, newScene);
    }
  };

  // Start AR session
  const startARSession = async () => {
    if (!rendererRef.current) {
      alert('System not ready. Please wait...');
      return;
    }

    if (!arSupported) {
      alert('WebXR AR is not supported on this device');
      return;
    }

    try {
      addLog('🚀 Starting AR session...');
      setStatusMessage('Starting AR session...');

      // Request session with hit-test as required feature
      const sessionOptions = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'plane-detection'],
      };

      const session = await navigator.xr.requestSession('immersive-ar', sessionOptions);

      addLog('✅ AR session created!');
      xrSessionRef.current = session;

      await rendererRef.current.renderer.xr.setSession(session);

      // Set up hit test source
      if (session.enabledFeatures && Array.from(session.enabledFeatures).includes('hit-test')) {
        try {
          const viewerSpace = await session.requestReferenceSpace('viewer');
          const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
          hitTestSourceRef.current = hitTestSource;
          console.log('✅ Hit-test source created successfully');
        } catch (e) {
          console.warn('⚠️ Hit-test source creation failed:', e.message);
        }
      }

      // Load initial model and speak script
      try {
        addLog(`📦 Loading initial model: ${scenes[currentScene].name}...`);
        const model = await loadModelForScene(currentScene);
        rendererRef.current.loadedModel = model;
        addLog(`✅ ${scenes[currentScene].name} ready! Tap screen to place it`);

        // Speak the initial scene script
        speakText(scenes[currentScene].script, currentScene);
      } catch (e) {
        addLog(`❌ Failed to load initial model: ${e.message}`);
      }

      // Set up tap-to-place controller
      const controller = rendererRef.current.renderer.xr.getController(0);
      controller.addEventListener('select', () => {
        addLog('👆 Screen tapped!');

        const reticle = reticleRef.current;
        const model = rendererRef.current.loadedModel;

        if (!reticle || !reticle.visible) {
          addLog('⚠️ No surface detected. Move your device to find a surface.');
          return;
        }

        if (!model) {
          addLog('⚠️ Model not loaded yet. Please wait...');
          return;
        }

        // Remove previous model if exists
        if (placedModelRef.current) {
          addLog('🗑️ Removing previous model');
          rendererRef.current.scene.remove(placedModelRef.current);
        }

        // Clone and place new model
        const newModel = model.clone();
        newModel.position.setFromMatrixPosition(reticle.matrix);
        rendererRef.current.scene.add(newModel);
        placedModelRef.current = newModel;
        addLog(`✅ ${scenes[currentScene].name} placed at (${newModel.position.x.toFixed(2)}, ${newModel.position.y.toFixed(2)}, ${newModel.position.z.toFixed(2)})`);
      });
      controllerRef.current = controller;
      rendererRef.current.scene.add(controller);

      setSessionActive(true);
      setStatusMessage('AR Session Active');
      console.log('✅ AR Session fully initialized!');

      // Handle session end
      session.addEventListener('end', () => {
        console.log('AR session ended');
        setSessionActive(false);
        setStatusMessage('AR session ended');
        xrSessionRef.current = null;
        hitTestSourceRef.current = null;

        // Stop auto-play
        setAutoPlay(false);
        autoPlayRef.current = false; // Sync ref
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
          autoPlayTimerRef.current = null;
        }

        // Clean up placed model
        if (placedModelRef.current) {
          rendererRef.current.scene.remove(placedModelRef.current);
          placedModelRef.current = null;
        }

        // Hide reticle
        if (reticleRef.current) {
          reticleRef.current.visible = false;
        }

        // Stop speech
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      });

    } catch (error) {
      console.error('AR Session Error:', error);

      let errorMsg = `Error: ${error.name}\n${error.message}`;

      if (error.name === 'NotSupportedError') {
        errorMsg = '❌ WebXR with hit-test not supported.\n\nPossible reasons:\n1. Device does not support ARCore\n2. Browser needs update\n3. WebXR features not available';
      } else if (error.name === 'NotAllowedError') {
        errorMsg = '❌ Permission denied.\n\nPlease allow camera permission and try again.';
      } else if (error.name === 'SecurityError') {
        errorMsg = '❌ Security error.\n\nMust be accessed via HTTPS (not HTTP).';
      }

      alert(errorMsg);
      setStatusMessage(`Error: ${error.name}`);
    }
  };

  const endARSession = () => {
    if (xrSessionRef.current) {
      console.log('Ending AR session manually...');
      xrSessionRef.current.end();
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F8F5F2'}}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: sessionActive ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: sessionActive ? 'block' : 'none',
          zIndex: 0
        }}
      />

      {/* UI Overlay */}
      {!sessionActive && (
        <>
          <nav className="fixed top-0 w-full backdrop-blur-md z-50 border-b" style={{backgroundColor: 'rgba(248, 245, 242, 0.95)', borderColor: '#D4A373'}}>
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/1.svg" alt="Lelana Logo" className="h-10" />
                </div>
                <div className="flex items-center gap-4">
                  <a href="/" className="text-sm font-medium transition" style={{color: '#473C8B'}}>
                    ← Kembali ke Home
                  </a>
                </div>
              </div>
            </div>
          </nav>

          <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold" style={{color: '#1B1B1E'}}>
                  Pengalaman AR Budaya
                </h1>
                <div className="flex gap-3 justify-center items-center flex-wrap">
                  <div className="inline-block px-6 py-2 rounded-full font-medium text-sm" style={{backgroundColor: '#D4A373', color: 'white'}}>
                    Scene {currentScene + 1} / {scenes.length}
                  </div>
                  {isSpeaking && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm" style={{backgroundColor: '#FFC857', color: '#1B1B1E'}}>
                      🔊 Narasi
                    </div>
                  )}
                </div>
                <div className="text-sm px-4 py-2 rounded-lg inline-block" style={{
                  backgroundColor: arSupported ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                  color: arSupported ? '#4CAF50' : '#FF9800'
                }}>
                  {statusMessage}
                </div>
              </div>

              {/* Start AR Button */}
              <div className="rounded-3xl shadow-lg p-8 mb-8 text-center" style={{backgroundColor: 'white', border: '2px solid #D4A373'}}>
                <div className="mb-6">
                  <div className="text-6xl mb-4">{currentScene === 0 ? '🐊' : '🍌'}</div>
                  <h3 className="text-2xl font-bold mb-2" style={{color: '#473C8B'}}>
                    {scenes[currentScene].name}
                  </h3>
                  <p className="text-gray-600">
                    {scenes[currentScene].script}
                  </p>
                </div>

                <button
                  onClick={startARSession}
                  disabled={!arSupported || !rendererRef.current}
                  className="px-8 py-4 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#473C8B'
                  }}
                >
                  👁️ Mulai Pengalaman AR
                </button>
              </div>

              {/* Script Display Card */}
              <div className="rounded-3xl p-8 mb-8 relative overflow-hidden" style={{backgroundColor: '#473C8B'}}>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'url(/batik.png)',
                  backgroundSize: 'cover'
                }}></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 text-center" style={{color: '#F8F5F2'}}>
                    Cerita Budaya Indonesia
                  </h3>
                  <div className="space-y-4">
                    {scenes.map((scene, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg transition-all ${index === currentScene ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-5'}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{index === 0 ? '🐊' : '🍌'}</span>
                          <span className="font-semibold" style={{color: '#FFC857'}}>
                            {scene.name}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{color: '#F8F5F2'}}>
                          {scene.script}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features Info */}
              <div className="rounded-3xl p-8 backdrop-blur-sm mb-8" style={{backgroundColor: 'rgba(212, 163, 115, 0.15)', border: '1px solid #D4A373'}}>
                <h3 className="font-bold text-xl mb-4" style={{color: '#1B1B1E'}}>Fitur AR:</h3>
                <ul className="space-y-3 mb-4" style={{color: '#473C8B'}}>
                  <li>✅ Deteksi permukaan & penempatan 3D</li>
                  <li>✅ Model berputar otomatis</li>
                  <li>✅ Narasi audio text-to-speech</li>
                  <li>✅ Pergantian scene dinamis</li>
                  <li>✅ Storyline budaya Indonesia</li>
                </ul>
                <div className="p-4 rounded-lg" style={{backgroundColor: 'rgba(71, 60, 139, 0.1)'}}>
                  <p className="text-sm font-semibold mb-2" style={{color: '#473C8B'}}>
                    📱 Requirements:
                  </p>
                  <ul className="text-sm space-y-1" style={{color: '#473C8B'}}>
                    <li>• Android device with ARCore</li>
                    <li>• Chrome or Edge browser</li>
                    <li>• HTTPS connection</li>
                    <li>• Camera permission</li>
                  </ul>
                </div>
              </div>

              {/* Console Logs */}
              <div className="rounded-3xl p-6" style={{backgroundColor: 'rgba(0, 0, 0, 0.9)', border: '2px solid #4CAF50'}}>
                <h3 className="font-bold text-lg mb-3" style={{color: '#00ff00'}}>📋 Console Logs:</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {logs.length === 0 ? (
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>No logs yet...</div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} style={{ color: '#00ff00', fontSize: '0.85rem', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* AR Session Active Overlay */}
      {sessionActive && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 1
          }}
        >
          {/* Top - Script Display */}
          <div style={{
            backgroundColor: 'rgba(71, 60, 139, 0.95)',
            color: 'white',
            padding: '1rem',
            margin: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '90%',
            alignSelf: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {scenes[currentScene].name} {isSpeaking && '🔊'}
            </div>
            <div style={{ fontSize: '1rem', lineHeight: '1.5' }}>
              {scenes[currentScene].script}
            </div>
          </div>

          {/* Bottom - Controls */}
          <div style={{
            backgroundColor: 'rgba(248, 245, 242, 0.95)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Scene Navigation */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                backgroundColor: '#D4A373',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                Scene {currentScene + 1}/{scenes.length}
              </div>

              <button
                onClick={toggleAutoPlay}
                style={{
                  backgroundColor: autoPlay ? '#FFC857' : '#D4A373',
                  color: autoPlay ? '#1B1B1E' : 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {autoPlay ? '⏸️ Pause' : '▶️ Auto'}
              </button>

              <button
                onClick={prevScene}
                disabled={currentScene === 0}
                style={{
                  backgroundColor: currentScene === 0 ? '#ccc' : 'white',
                  color: '#473C8B',
                  border: '2px solid #473C8B',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: currentScene === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentScene === 0 ? 0.5 : 1
                }}
              >
                ← Prev
              </button>

              <button
                onClick={nextScene}
                disabled={currentScene === scenes.length - 1}
                style={{
                  backgroundColor: currentScene === scenes.length - 1 ? '#ccc' : 'white',
                  color: '#473C8B',
                  border: '2px solid #473C8B',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: currentScene === scenes.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentScene === scenes.length - 1 ? 0.5 : 1
                }}
              >
                Next →
              </button>

              <button
                onClick={endARSession}
                style={{
                  backgroundColor: '#DC3545',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                🛑 Exit
              </button>
            </div>

            <div style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#473C8B',
              marginTop: '0.25rem'
            }}>
              <p style={{ margin: 0, marginBottom: '0.25rem' }}>
                👆 Tap screen to place {scenes[currentScene].name}
              </p>
              {autoPlay && (
                <p style={{ margin: 0, color: '#FFC857', fontWeight: 'bold' }}>
                  {isSpeaking ? '🔊 Listening to story...' : '⏱️ Next scene in 5 seconds...'}
                </p>
              )}
            </div>

            {/* Debug Console Log */}
            <div style={{
              marginTop: '1rem',
              backgroundColor: '#1B1B1E',
              borderRadius: '8px',
              padding: '0.75rem',
              maxHeight: '200px',
              overflowY: 'auto',
              fontSize: '0.7rem',
              fontFamily: 'monospace'
            }}>
              <div style={{ color: '#4CAF50', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                📋 Debug Console:
              </div>
              {logs.length === 0 ? (
                <div style={{ color: '#888', fontSize: '0.65rem' }}>No logs yet...</div>
              ) : (
                logs.slice(-10).map((log, index) => (
                  <div key={index} style={{ color: '#4CAF50', marginBottom: '0.25rem', lineHeight: '1.3' }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
