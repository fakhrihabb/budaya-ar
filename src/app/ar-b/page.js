'use client';

import { useState, useEffect, useRef } from 'react';

export default function ARBPage() {
  const [arSupported, setArSupported] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Initializing...');
  const [currentScene, setCurrentScene] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const xrSessionRef = useRef(null);
  const hitTestSourceRef = useRef(null);
  const reticleRef = useRef(null);
  const placedModelRef = useRef(null);
  const controllerRef = useRef(null);
  const speechSynthesisRef = useRef(null);

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

  // Text-to-speech function
  const speakText = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Check WebXR support
  useEffect(() => {
    const checkSupport = async () => {
      setStatusMessage('Checking WebXR support...');

      if (!navigator.xr) {
        setStatusMessage('WebXR not available');
        setArSupported(false);
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        setArSupported(supported);
        setStatusMessage(supported ? 'WebXR AR supported!' : 'WebXR AR not supported');
      } catch (e) {
        console.error('Error checking support:', e);
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

  // Load model for current scene
  const loadCurrentModel = async () => {
    try {
      const scene = scenes[currentScene];
      console.log(`Loading ${scene.name} model...`);

      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      const modelUrl = window.location.origin + scene.model;

      return new Promise((resolve, reject) => {
        loader.load(
          modelUrl,
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(scene.scale, scene.scale, scene.scale);
            console.log(`✅ ${scene.name} model loaded!`);
            resolve(model);
          },
          undefined,
          (error) => {
            console.error(`Error loading ${scene.name} model:`, error);
            reject(error);
          }
        );
      });
    } catch (e) {
      console.error('Error setting up model loader:', e);
      throw e;
    }
  };

  // Switch to next scene
  const nextScene = async () => {
    if (currentScene < scenes.length - 1) {
      const newScene = currentScene + 1;
      setCurrentScene(newScene);
      console.log(`Switching to scene ${newScene + 1}: ${scenes[newScene].name}`);

      // Speak new scene script
      speakText(scenes[newScene].script);

      // Load new model if in AR
      if (sessionActive && rendererRef.current) {
        try {
          const model = await loadCurrentModel();
          rendererRef.current.loadedModel = model;
        } catch (e) {
          console.error(`Failed to load ${scenes[newScene].name}`);
        }
      }
    }
  };

  // Switch to previous scene
  const prevScene = async () => {
    if (currentScene > 0) {
      const newScene = currentScene - 1;
      setCurrentScene(newScene);
      console.log(`Switching to scene ${newScene + 1}: ${scenes[newScene].name}`);

      // Speak new scene script
      speakText(scenes[newScene].script);

      // Load new model if in AR
      if (sessionActive && rendererRef.current) {
        try {
          const model = await loadCurrentModel();
          rendererRef.current.loadedModel = model;
        } catch (e) {
          console.error(`Failed to load ${scenes[newScene].name}`);
        }
      }
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
      console.log('Starting AR session...');
      setStatusMessage('Starting AR session...');

      // Request session with hit-test as required feature
      const sessionOptions = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'plane-detection'],
      };

      const session = await navigator.xr.requestSession('immersive-ar', sessionOptions);

      console.log('✅ AR session created successfully!');
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
        const model = await loadCurrentModel();
        rendererRef.current.loadedModel = model;
        console.log(`✅ ${scenes[currentScene].name} ready! Tap screen to place it`);

        // Speak the initial scene script
        speakText(scenes[currentScene].script);
      } catch (e) {
        console.error('Failed to load initial model:', e);
      }

      // Set up tap-to-place controller
      const controller = rendererRef.current.renderer.xr.getController(0);
      controller.addEventListener('select', () => {
        console.log('👆 Screen tapped!');

        const reticle = reticleRef.current;
        const model = rendererRef.current.loadedModel;

        if (!reticle || !reticle.visible) {
          console.warn('No surface detected. Move your device to find a surface.');
          return;
        }

        if (!model) {
          console.warn('Model not loaded yet. Please wait...');
          return;
        }

        // Remove previous model if exists
        if (placedModelRef.current) {
          rendererRef.current.scene.remove(placedModelRef.current);
        }

        // Clone and place new model
        const newModel = model.clone();
        newModel.position.setFromMatrixPosition(reticle.matrix);
        rendererRef.current.scene.add(newModel);
        placedModelRef.current = newModel;
        console.log(`✅ ${scenes[currentScene].name} placed! It will auto-rotate`);
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
              <div className="rounded-3xl p-8 backdrop-blur-sm" style={{backgroundColor: 'rgba(212, 163, 115, 0.15)', border: '1px solid #D4A373'}}>
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

            <p style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#473C8B',
              margin: 0
            }}>
              👆 Tap screen to place {scenes[currentScene].name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
