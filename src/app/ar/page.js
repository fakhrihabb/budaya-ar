'use client';

import { useState, useEffect, useRef } from 'react';

export default function ARPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isInAR, setIsInAR] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Initializing...');

  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const reticleRef = useRef(null);
  const hitTestSourceRef = useRef(null);
  const currentModelRef = useRef(null);
  const xrSessionRef = useRef(null);
  const placedModelRef = useRef(null);

  const scenes = [
    {
      model: '/models/cartoon_crocodile_croco-roco.glb',
      script: 'In ancient Indonesian waters, crocodiles were revered as sacred creatures.',
      scale: 0.3
    },
    {
      model: '/models/banana.glb',
      script: 'Bananas have been cultivated in Indonesia for thousands of years as a staple food.',
      scale: 0.5
    }
  ];

  // Check WebXR support
  useEffect(() => {
    const checkSupport = async () => {
      setStatusMessage('Checking WebXR support...');

      if (!navigator.xr) {
        setStatusMessage('WebXR not available. Please use Chrome or Edge.');
        setArSupported(false);
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        setArSupported(supported);
        setStatusMessage(supported ? 'WebXR AR supported!' : 'WebXR AR not supported on this device');
        console.log('WebXR AR supported:', supported);
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
        setStatusMessage('Loading Three.js...');
        const THREE = await import('three');

        // Create scene
        const scene = new THREE.Scene();

        // Create camera
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        // Create renderer with optimized settings for mobile
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;

        // Add lighting
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 1);
        light.position.set(0.5, 1, 0.25);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // Create reticle
        const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
        const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add(reticle);

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        reticleRef.current = reticle;

        // Animation loop
        function animate(_timestamp, frame) {
          if (frame && xrSessionRef.current) {
            const referenceSpace = renderer.xr.getReferenceSpace();

            // Hit test
            if (hitTestSourceRef.current) {
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
        }

        renderer.setAnimationLoop(animate);

        setIsReady(true);
        setStatusMessage('Ready! Tap "Start AR" button');
        console.log('Three.js initialized successfully');

      } catch (error) {
        console.error('Error initializing Three.js:', error);
        setStatusMessage('Error initializing 3D engine');
      }
    };

    init();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
      }
    };
  }, []);

  // Load model
  const loadModel = async (sceneIndex) => {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

    const loader = new GLTFLoader();
    const modelUrl = window.location.origin + scenes[sceneIndex].model;

    return new Promise((resolve, reject) => {
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(scenes[sceneIndex].scale, scenes[sceneIndex].scale, scenes[sceneIndex].scale);
          currentModelRef.current = model;
          console.log('Model loaded:', modelUrl);
          resolve(model);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  };

  // Place model on tap
  const placeModel = () => {
    if (!reticleRef.current || !reticleRef.current.visible || !currentModelRef.current) return;

    console.log('Placing model');

    // Remove previous model
    if (placedModelRef.current) {
      sceneRef.current.remove(placedModelRef.current);
    }

    // Clone and place new model
    const model = currentModelRef.current.clone();
    model.position.setFromMatrixPosition(reticleRef.current.matrix);
    sceneRef.current.add(model);
    placedModelRef.current = model;

    // Auto-switch if enabled
    if (autoPlay && currentScene < scenes.length - 1) {
      setTimeout(() => {
        nextScene();
      }, 5000); // 5 seconds per scene
    }
  };

  // Start AR session
  const startAR = async () => {
    if (!isReady || !rendererRef.current) {
      alert('System not ready. Please wait...');
      return;
    }

    if (!arSupported) {
      alert('WebXR AR tidak didukung di device ini.\n\nPastikan:\n- Menggunakan Chrome atau Edge\n- Device support ARCore\n- Akses via HTTPS');
      return;
    }

    try {
      console.log('Starting AR session...');
      console.log('Navigator.xr:', navigator.xr);
      setStatusMessage('Starting AR...');

      const overlayElement = document.getElementById('ar-overlay');

      // Try different configurations with detailed logging
      let session;

      // Attempt 1: Minimal - just immersive-ar with no features
      try {
        console.log('Attempt 1: Minimal session (no features)...');
        session = await navigator.xr.requestSession('immersive-ar', {
          optionalFeatures: []
        });
        console.log('✅ Minimal session created successfully');
      } catch (e1) {
        console.error('❌ Minimal session failed:', e1.name, e1.message);

        // Attempt 2: With hit-test only
        try {
          console.log('Attempt 2: With hit-test...');
          session = await navigator.xr.requestSession('immersive-ar', {
            optionalFeatures: ['hit-test']
          });
          console.log('✅ Session with hit-test created successfully');
        } catch (e2) {
          console.error('❌ Session with hit-test failed:', e2.name, e2.message);

          // Attempt 3: With local-floor reference space
          try {
            console.log('Attempt 3: With local-floor...');
            session = await navigator.xr.requestSession('immersive-ar', {
              optionalFeatures: ['local-floor']
            });
            console.log('✅ Session with local-floor created successfully');
          } catch (e3) {
            console.error('❌ Session with local-floor failed:', e3.name, e3.message);
            throw e1; // Throw the first error
          }
        }
      }

      console.log('✅ AR session created:', session);
      xrSessionRef.current = session;

      await rendererRef.current.xr.setSession(session);
      setIsInAR(true);
      setStatusMessage('AR Active');

      // Set up hit test if supported - try different reference spaces
      try {
        let referenceSpace;

        // Try local-floor first (most common for AR)
        try {
          console.log('Trying local-floor reference space...');
          referenceSpace = await session.requestReferenceSpace('local-floor');
          console.log('✅ local-floor reference space created');
        } catch (e1) {
          console.warn('❌ local-floor failed:', e1.message);

          // Fallback to local
          try {
            console.log('Trying local reference space...');
            referenceSpace = await session.requestReferenceSpace('local');
            console.log('✅ local reference space created');
          } catch (e2) {
            console.warn('❌ local failed:', e2.message);

            // Last resort: viewer
            console.log('Trying viewer reference space...');
            referenceSpace = await session.requestReferenceSpace('viewer');
            console.log('✅ viewer reference space created');
          }
        }

        // Now try to create hit test source
        hitTestSourceRef.current = await session.requestHitTestSource({ space: referenceSpace });
        console.log('✅ Hit-test source created');
      } catch (hitTestError) {
        console.warn('⚠️ Hit-test not available:', hitTestError.name, hitTestError.message);
        console.log('AR will work but without surface detection reticle');
      }

      // Load initial model
      await loadModel(currentScene);

      // Handle tap to place
      const controller = rendererRef.current.xr.getController(0);
      controller.addEventListener('select', placeModel);
      sceneRef.current.add(controller);

      // Handle session end
      session.addEventListener('end', () => {
        console.log('AR session ended');
        setIsInAR(false);
        setStatusMessage('AR ended');
        hitTestSourceRef.current = null;
        xrSessionRef.current = null;
        placedModelRef.current = null;
      });

    } catch (error) {
      console.error('=== AR ERROR DETAILS ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error object:', error);

      let errorMsg = '❌ Error: ' + error.name + '\n\n' + error.message;

      if (error.name === 'NotSupportedError') {
        errorMsg += '\n\nTroubleshooting:\n';
        errorMsg += '1. Open chrome://flags\n';
        errorMsg += '2. Enable "WebXR Incubations"\n';
        errorMsg += '3. Pastikan ARCore terinstall\n';
        errorMsg += '4. Restart Chrome\n\n';
        errorMsg += 'Cek console log untuk detail.';
      } else if (error.name === 'NotAllowedError') {
        errorMsg = '❌ Permission ditolak.\n\nAllow camera permission dan coba lagi.';
      } else if (error.name === 'SecurityError') {
        errorMsg = '❌ Security error.\n\nHarus diakses via HTTPS (bukan HTTP).';
      }

      alert(errorMsg);
      setStatusMessage('Error: ' + error.name);
    }
  };

  const nextScene = async () => {
    if (currentScene < scenes.length - 1) {
      const newScene = currentScene + 1;
      setCurrentScene(newScene);
      if (isInAR) {
        await loadModel(newScene);
      }
    }
  };

  const prevScene = async () => {
    if (currentScene > 0) {
      const newScene = currentScene - 1;
      setCurrentScene(newScene);
      if (isInAR) {
        await loadModel(newScene);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f5ff 50%, #fff9f5 100%)'
      }}>
        {/* Animated Background Elements (only show when not in AR) */}
        {!isInAR && (
          <div className="fixed inset-0 pointer-events-none">
            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30" style={{
              background: 'radial-gradient(circle, rgba(138, 127, 216, 0.3), transparent 70%)',
              animation: 'float 8s ease-in-out infinite',
              filter: 'blur(40px)'
            }} />
            <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full opacity-30" style={{
              background: 'radial-gradient(circle, rgba(212, 163, 115, 0.3), transparent 70%)',
              animation: 'float 10s ease-in-out infinite reverse',
              filter: 'blur(40px)'
            }} />
            <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full opacity-20" style={{
              background: 'radial-gradient(circle, rgba(255, 200, 87, 0.25), transparent 70%)',
              animation: 'float 12s ease-in-out infinite',
              filter: 'blur(50px)'
            }} />

            {/* Animated Grid */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(#473C8B 1px, transparent 1px), linear-gradient(90deg, #473C8B 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }} />
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: isInAR ? 'fixed' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: isInAR ? 'block' : 'none',
            zIndex: 0
          }}
        />

        {/* AR Overlay */}
        <div
          id="ar-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: isInAR ? 'auto' : 'none',
            display: isInAR ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 1
          }}
        >
          {/* Script text overlay */}
          <div style={{
            backgroundColor: 'rgba(71, 60, 139, 0.95)',
            color: 'white',
            padding: '1rem',
            margin: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: '500',
            maxWidth: '90%',
            alignSelf: 'center'
          }}>
            {scenes[currentScene].script}
          </div>

          {/* Bottom controls */}
          <div style={{
            backgroundColor: 'rgba(248, 245, 242, 0.95)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              alignItems: 'center',
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
                onClick={() => setAutoPlay(!autoPlay)}
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
                  backgroundColor: 'white',
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
                  backgroundColor: 'white',
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
            </div>

            <p style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#473C8B',
              margin: 0
            }}>
              👆 Tap screen to place model
            </p>
          </div>
        </div>

        {/* Regular UI */}
        {!isInAR && (
          <>
            <div className="pt-8 px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                  <h1 className="text-4xl sm:text-5xl font-bold" style={{
                    color: '#1B1B1E',
                    textShadow: '0 0 20px rgba(138, 127, 216, 0.2)'
                  }}>
                    WebXR AR Experience
                  </h1>
                  <div className="inline-block px-6 py-3 rounded-full font-semibold text-sm relative overflow-hidden" style={{
                    background: 'linear-gradient(135deg, #D4A373 0%, #F4A460 100%)',
                    color: 'white',
                    border: '2px solid rgba(212, 163, 115, 0.4)',
                    boxShadow: '0 0 20px rgba(212, 163, 115, 0.3)',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                  }}>
                    <div className="absolute inset-0 opacity-30" style={{
                      background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      animation: 'shimmer 2s infinite'
                    }} />
                    <span className="relative z-10">Scene {currentScene + 1} dari {scenes.length}</span>
                  </div>
                  <div className="text-sm px-4 py-2 rounded-2xl inline-block" style={{
                    background: isReady && arSupported
                      ? 'rgba(76, 175, 80, 0.15)'
                      : 'rgba(255, 152, 0, 0.15)',
                    color: isReady && arSupported ? '#4CAF50' : '#FF9800',
                    border: `2px solid ${isReady && arSupported ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 15px ${isReady && arSupported ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)'}`
                  }}>
                    {statusMessage}
                  </div>
                </div>

                <div className="relative rounded-3xl p-8 mb-8 text-center overflow-hidden" style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(212, 163, 115, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    background: 'radial-gradient(circle at top, rgba(212, 163, 115, 0.2), transparent 70%)'
                  }} />

                  <div className="mb-6 p-8 relative z-10" style={{color: '#473C8B', fontSize: '1.1rem'}}>
                    <p className="mb-4 font-semibold">📱 Current Scene:</p>
                    <p className="font-bold text-xl" style={{
                      textShadow: '0 0 15px rgba(138, 127, 216, 0.2)'
                    }}>{scenes[currentScene].model.split('/').pop()}</p>
                  </div>

                  <button
                    onClick={startAR}
                    disabled={!isReady || !arSupported}
                    className="relative px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 overflow-hidden group"
                    style={{
                      background: (isReady && arSupported)
                        ? 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)'
                        : '#ccc',
                      cursor: (isReady && arSupported) ? 'pointer' : 'not-allowed',
                      opacity: (isReady && arSupported) ? 1 : 0.6,
                      border: '2px solid rgba(138, 127, 216, 0.4)',
                      boxShadow: (isReady && arSupported)
                        ? '0 0 30px rgba(138, 127, 216, 0.3)'
                        : 'none',
                      textShadow: (isReady && arSupported)
                        ? '0 0 10px rgba(255, 255, 255, 0.5)'
                        : 'none',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (isReady && arSupported) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 0 40px rgba(138, 127, 216, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isReady && arSupported) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(138, 127, 216, 0.3)';
                      }
                    }}
                  >
                    {(isReady && arSupported) && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                        background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
                        animation: 'shimmer 2s infinite'
                      }} />
                    )}
                    <span className="relative z-10">{!isReady ? '⏳ Loading...' : '👁️ Start AR'}</span>
                  </button>
                </div>

                <div className="relative rounded-3xl p-8 mb-8 overflow-hidden" style={{
                  background: 'linear-gradient(135deg, #473C8B 0%, #6B5FBD 100%)',
                  border: '2px solid rgba(138, 127, 216, 0.4)',
                  boxShadow: '0 0 30px rgba(138, 127, 216, 0.3)'
                }}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    background: 'radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.2), transparent 70%)'
                  }} />
                  <p className="relative z-10 text-xl text-center font-light leading-relaxed" style={{
                    color: '#F8F5F2',
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                  }}>
                    {scenes[currentScene].script}
                  </p>
                </div>

                <div className="relative rounded-3xl p-8 overflow-hidden" style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(212, 163, 115, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    background: 'radial-gradient(circle at top left, rgba(212, 163, 115, 0.2), transparent 70%)'
                  }} />

                  <h3 className="font-bold text-xl mb-4 relative z-10" style={{
                    color: '#1B1B1E',
                    textShadow: '0 0 15px rgba(138, 127, 216, 0.2)'
                  }}>WebXR Features:</h3>
                  <ul className="space-y-3 mb-4 relative z-10" style={{color: '#8B7355'}}>
                    <li>✅ Surface detection & placement</li>
                    <li>✅ Auto-rotate models</li>
                    <li>✅ Text overlay in AR</li>
                    <li>✅ Scene switching in AR</li>
                    <li>✅ Auto-play mode</li>
                  </ul>
                  <div className="p-4 rounded-2xl mb-4 relative z-10" style={{
                    background: 'rgba(138, 127, 216, 0.15)',
                    border: '2px solid rgba(138, 127, 216, 0.25)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <p className="text-sm font-bold mb-2" style={{color: '#473C8B'}}>
                      📱 Requirements:
                    </p>
                    <ul className="text-sm space-y-1" style={{color: '#6B5FBD'}}>
                      <li>• Chrome 79+ or Edge browser</li>
                      <li>• HTTPS connection required</li>
                      <li>• Allow camera permission</li>
                      <li>• ARCore installed (Android)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl relative z-10" style={{
                    background: 'rgba(255, 152, 0, 0.15)',
                    borderLeft: '4px solid #FF9800',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <p className="text-sm font-bold mb-2" style={{color: '#FF9800'}}>
                      🔧 Jika masih error:
                    </p>
                    <ol className="text-sm space-y-1" style={{color: '#8B7355'}}>
                      <li>1. Buka chrome://flags di Chrome</li>
                      <li>2. Cari &quot;WebXR Incubations&quot;</li>
                      <li>3. Set ke &quot;Enabled&quot;</li>
                      <li>4. Restart Chrome</li>
                      <li>5. Cek Console Log (chrome://inspect)</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(-10px) translateX(-10px);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
