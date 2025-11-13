'use client';

import { useState, useEffect, useRef } from 'react';

export default function ARDebug2Page() {
  const [arSupported, setArSupported] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [surfaceFound, setSurfaceFound] = useState(false);
  const [modelPlaced, setModelPlaced] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState([]);

  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const xrSessionRef = useRef(null);
  const hitTestSourceRef = useRef(null);
  const reticleRef = useRef(null);
  const placedModelRef = useRef(null);
  const statusIndicatorRef = useRef(null);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logMsg]);
    console.log(logMsg);
  };

  // Check WebXR support
  useEffect(() => {
    const checkSupport = async () => {
      addLog('🔍 Checking WebXR support...');
      if (!navigator.xr) {
        addLog('❌ navigator.xr not available');
        setArSupported(false);
        return;
      }
      addLog('✅ navigator.xr available');
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        addLog(`AR Support: ${supported ? '✅ YES' : '❌ NO'}`);
        setArSupported(supported);
      } catch (e) {
        addLog(`❌ Error: ${e.message}`);
        setArSupported(false);
      }
    };
    checkSupport();
  }, []);

  // Initialize Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = async () => {
      try {
        addLog('⚙️ Initializing Three.js...');
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
        
        // Set reference space to 'local' for Samsung Tab S9 compatibility
        if (renderer.xr.setReferenceSpaceType) {
          renderer.xr.setReferenceSpaceType('local');
        }

        // Lighting
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 1);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // Create BIGGER, BRIGHTER reticle with pulsing animation
        const reticleGeometry = new THREE.RingGeometry(0.12, 0.18, 32).rotateX(-Math.PI / 2);
        const reticleMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x00ff00,
          transparent: true,
          opacity: 0.8
        });
        const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add(reticle);
        reticleRef.current = reticle;
        addLog('✅ Reticle created (green pulsing ring)');

        // Create 3D status indicator (visible in AR)
        const statusGeometry = new THREE.PlaneGeometry(0.5, 0.15);
        const statusMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xFF8C00,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide
        });
        const statusIndicator = new THREE.Mesh(statusGeometry, statusMaterial);
        statusIndicator.visible = false;
        scene.add(statusIndicator);
        statusIndicatorRef.current = statusIndicator;
        addLog('✅ 3D status indicator created');

        rendererRef.current = { THREE, renderer, scene, camera, reticleMaterial, statusMaterial };
        addLog('✅ Three.js initialized successfully');

        let pulseTime = 0;
        let lastSurfaceState = false;
        renderer.setAnimationLoop((timestamp, frame) => {
          // Handle hit testing in AR mode
          if (frame && xrSessionRef.current) {
            const referenceSpace = renderer.xr.getReferenceSpace();
            const reticle = reticleRef.current;
            const statusIndicator = statusIndicatorRef.current;
            const camera = renderer.xr.getCamera();

            // Position status indicator in front of camera
            if (statusIndicator && camera) {
              const cameraDirection = new THREE.Vector3();
              camera.getWorldDirection(cameraDirection);
              const indicatorPosition = camera.position.clone();
              indicatorPosition.add(cameraDirection.multiplyScalar(1.5)); // 1.5m in front
              indicatorPosition.y += 0.3; // Slightly above center
              statusIndicator.position.copy(indicatorPosition);
              statusIndicator.lookAt(camera.position);
            }

            // Perform hit test to find surfaces
            if (hitTestSourceRef.current && referenceSpace && reticle) {
              const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
              if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose(referenceSpace);
                reticle.visible = true;
                reticle.matrix.fromArray(pose.transform.matrix);
                
                // Pulsing animation for reticle
                pulseTime += 0.05;
                const scale = 1 + Math.sin(pulseTime) * 0.2;
                reticle.scale.set(scale, scale, scale);
                
                // Update status indicator - GREEN
                if (statusIndicator) {
                  statusIndicator.visible = true;
                  statusIndicator.material.color.setHex(0x00FF00); // Green
                }
                
                // Update UI state and log change
                if (!lastSurfaceState) {
                  addLog('✅ Surface detected!');
                  lastSurfaceState = true;
                }
                setSurfaceFound(true);
              } else {
                reticle.visible = false;
                
                // Update status indicator - ORANGE (scanning)
                if (statusIndicator) {
                  statusIndicator.visible = true;
                  statusIndicator.material.color.setHex(0xFF8C00); // Orange
                  // Pulse animation
                  const opacity = 0.7 + Math.sin(timestamp * 0.003) * 0.3;
                  statusIndicator.material.opacity = opacity;
                }
                
                if (lastSurfaceState) {
                  addLog('⚠️ Surface lost, keep scanning...');
                  lastSurfaceState = false;
                }
                setSurfaceFound(false);
              }
            }

            // Auto-rotate placed model
            if (placedModelRef.current) {
              placedModelRef.current.rotation.y += 0.01;
            }
          }

          renderer.render(scene, camera);
        });

      } catch (error) {
        console.error('Error initializing Three.js:', error);
      }
    };

    init();

    return () => {
      if (rendererRef.current?.renderer) {
        rendererRef.current.renderer.setAnimationLoop(null);
      }
    };
  }, []);

  // Start AR session
  const startAR = async () => {
    if (!rendererRef.current || !arSupported) {
      addLog('❌ AR not ready or not supported');
      alert('AR not ready or not supported');
      return;
    }

    try {
      addLog('🚀 Starting AR session...');
      
      // Get overlay element
      const overlayElement = document.getElementById('ar-overlay');
      
      const sessionOptions = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: overlayElement ? { root: overlayElement } : undefined
      };
      addLog(`Session options: ${JSON.stringify({requiredFeatures: sessionOptions.requiredFeatures, optionalFeatures: sessionOptions.optionalFeatures, hasDomOverlay: !!overlayElement})}`);

      const session = await navigator.xr.requestSession('immersive-ar', sessionOptions);
      addLog('✅ AR session created!');
      xrSessionRef.current = session;

      addLog('🎨 Setting session on Three.js renderer...');
      await rendererRef.current.renderer.xr.setSession(session);
      addLog('✅ Renderer session set');

      // Set up hit test source
      addLog('🎯 Setting up hit-test source...');
      const viewerSpace = await session.requestReferenceSpace('viewer');
      const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
      hitTestSourceRef.current = hitTestSource;
      addLog('✅ Hit-test ready - start scanning!');

      // Load 3D model
      addLog('🦎 Loading crocodile model...');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      const modelUrl = window.location.origin + '/models/cartoon_crocodile_croco-roco.glb';
      
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.3, 0.3, 0.3);
          rendererRef.current.loadedModel = model;
          addLog('✅ Crocodile model loaded!');
        },
        undefined,
        (error) => {
          addLog(`❌ Model load error: ${error.message}`);
          console.error('Error loading model:', error);
        }
      );

      // Set up tap-to-place
      const controller = rendererRef.current.renderer.xr.getController(0);
      controller.addEventListener('select', () => {
        addLog('👆 Screen tapped!');
        const reticle = reticleRef.current;
        const model = rendererRef.current.loadedModel;
        
        if (!reticle || !reticle.visible) {
          addLog('⚠️ No surface visible, cannot place');
          return;
        }
        
        if (!model) {
          addLog('⚠️ Model not loaded yet');
          return;
        }
        
        // Remove previous model
        if (placedModelRef.current) {
          rendererRef.current.scene.remove(placedModelRef.current);
          addLog('🗑️ Removed previous model');
        }
        
        // Clone and place new model
        const newModel = model.clone();
        newModel.position.setFromMatrixPosition(reticle.matrix);
        rendererRef.current.scene.add(newModel);
        placedModelRef.current = newModel;
        addLog('✅ Crocodile placed!');
        setModelPlaced(true);
        
        // Hide confirmation after 2 seconds
        setTimeout(() => setModelPlaced(false), 2000);
      });
      rendererRef.current.scene.add(controller);
      addLog('✅ Tap-to-place controller ready');
      
      // Show 3D status indicator
      if (statusIndicatorRef.current) {
        statusIndicatorRef.current.visible = true;
        addLog('✅ 3D status indicator activated');
      }
      
      setSessionActive(true);
      setIsScanning(true);
      setSurfaceFound(false);
      addLog('🎉 AR Session fully active!');
      addLog('📡 Scanning for surfaces...');
      addLog('🟠 Look for ORANGE indicator in AR view');

      // Handle session end
      session.addEventListener('end', () => {
        addLog('🛑 AR session ended');
        setSessionActive(false);
        setIsScanning(false);
        setSurfaceFound(false);
        setModelPlaced(false);
        xrSessionRef.current = null;
        hitTestSourceRef.current = null;
        
        if (placedModelRef.current) {
          rendererRef.current.scene.remove(placedModelRef.current);
          placedModelRef.current = null;
        }
        
        if (reticleRef.current) {
          reticleRef.current.visible = false;
        }
        
        if (statusIndicatorRef.current) {
          statusIndicatorRef.current.visible = false;
        }
      });

    } catch (error) {
      addLog(`❌ AR Error: ${error.name} - ${error.message}`);
      console.error('AR Error:', error);
      alert(`AR Error: ${error.message}`);
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

      {/* AR Session Active Overlay with CLEAR VISUAL FEEDBACK */}
      {sessionActive && (
        <div
          id="ar-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 9999
          }}
        >
          {/* Top status banner - ALWAYS VISIBLE */}
          <div style={{
            backgroundColor: surfaceFound ? 'rgba(34, 139, 34, 0.98)' : 'rgba(255, 140, 0, 0.98)',
            color: 'white',
            padding: '2rem 1.5rem',
            margin: '1.5rem',
            borderRadius: '20px',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: '800',
            maxWidth: '90%',
            alignSelf: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            border: '4px solid white',
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
          }}>
            {surfaceFound ? (
              <>
                <div style={{ fontSize: '4rem', marginBottom: '0.75rem', lineHeight: 1 }}>✅</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>SURFACE FOUND!</div>
                <div style={{ fontSize: '1.1rem', marginTop: '0.75rem', fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '12px' }}>👆 TAP SCREEN TO PLACE</div>
              </>
            ) : (
              <>
                {/* Spinning loader */}
                <div style={{ 
                  fontSize: '4rem', 
                  marginBottom: '0.75rem',
                  animation: 'spin 2s linear infinite',
                  display: 'inline-block',
                  lineHeight: 1
                }}>🔄</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>SCANNING...</div>
                <div style={{ fontSize: '1.1rem', marginTop: '0.75rem', fontWeight: '700' }}>📱 Move device slowly</div>
                <div style={{ 
                  marginTop: '0.75rem',
                  fontSize: '0.95rem',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>Point at floor or table</div>
              </>
            )}
          </div>

          {/* Model placed indicator */}
          {modelPlaced && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(34, 139, 34, 0.98)',
              color: 'white',
              padding: '2.5rem 4rem',
              borderRadius: '24px',
              fontSize: '1.8rem',
              fontWeight: '900',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
              zIndex: 10000,
              border: '5px solid white',
              animation: 'popIn 0.3s ease-out',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem', lineHeight: 1 }}>🦎</div>
              <div>PLACED!</div>
            </div>
          )}

          {/* Bottom controls with console */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            pointerEvents: 'auto',
            borderTop: '3px solid rgba(255,255,255,0.3)'
          }}>
            {/* Console log viewer */}
            <div style={{
              backgroundColor: '#000',
              borderRadius: '8px',
              padding: '0.75rem',
              maxHeight: '120px',
              overflowY: 'auto',
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              border: '2px solid #00ff00'
            }}>
              {logs.slice(-8).map((log, index) => (
                <div key={index} style={{ color: '#00ff00', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                  {log}
                </div>
              ))}
            </div>
            
            {/* End AR button */}
            <button
              onClick={() => xrSessionRef.current?.end()}
              style={{
                backgroundColor: '#DC3545',
                color: 'white',
                padding: '1.25rem 2rem',
                borderRadius: '16px',
                border: '3px solid white',
                fontWeight: '900',
                fontSize: '1.2rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                textTransform: 'uppercase'
              }}
            >
              🛑 END AR
            </button>
          </div>
        </div>
      )}

      {/* Regular UI */}
      {!sessionActive && (
        <>
          <nav className="fixed top-0 w-full backdrop-blur-md z-50 border-b" style={{backgroundColor: 'rgba(248, 245, 242, 0.95)', borderColor: '#D4A373'}}>
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold" style={{color: '#473C8B'}}>AR Debug v2 - Improved UX</h1>
                </div>
                <div className="flex items-center gap-4">
                  <a href="/" className="text-sm font-medium transition" style={{color: '#473C8B'}}>
                    ← Home
                  </a>
                  <a href="/ar-debug" className="text-sm font-medium transition" style={{color: '#473C8B'}}>
                    Debug v1
                  </a>
                </div>
              </div>
            </div>
          </nav>

          <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl sm:text-5xl font-bold" style={{color: '#1B1B1E'}}>
                  Improved AR Experience
                </h2>
                <p className="text-lg" style={{color: '#473C8B'}}>
                  Better visual feedback for surface detection
                </p>
              </div>

              {/* Start AR Button */}
              <div className="rounded-3xl shadow-lg p-12 mb-8 text-center" style={{backgroundColor: 'white', border: '2px solid #D4A373'}}>
                <button
                  onClick={startAR}
                  disabled={!arSupported}
                  className="px-12 py-5 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
                  style={{
                    backgroundColor: arSupported ? '#473C8B' : '#ccc',
                    boxShadow: arSupported ? '0 4px 12px rgba(71, 60, 139, 0.3)' : 'none'
                  }}
                >
                  {arSupported ? '🚀 Start AR Experience' : '❌ AR Not Supported'}
                </button>
              </div>

              {/* Improvements List */}
              <div className="rounded-3xl p-8 backdrop-blur-sm mb-8" style={{backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '2px solid #4CAF50'}}>
                <h3 className="font-bold text-xl mb-4" style={{color: '#1B1B1E'}}>✨ UX Improvements:</h3>
                <ul className="space-y-3" style={{color: '#473C8B'}}>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">🟢</span>
                    <div>
                      <strong>Bigger, Pulsing Reticle</strong><br />
                      <span className="text-sm">Green ring is larger and animates to be more visible</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <strong>Color-Coded Status Banner</strong><br />
                      <span className="text-sm">Orange = scanning, Green = surface found</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">💬</span>
                    <div>
                      <strong>Clear Instructions</strong><br />
                      <span className="text-sm">Real-time guidance on what to do</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong>Placement Confirmation</strong><br />
                      <span className="text-sm">Visual feedback when model is placed</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* How to Use */}
              <div className="rounded-3xl p-8 mb-8" style={{backgroundColor: 'rgba(71, 60, 139, 0.1)', border: '1px solid #473C8B'}}>
                <h3 className="font-bold text-xl mb-4" style={{color: '#473C8B'}}>📱 How to Use:</h3>
                <ol className="space-y-3 list-decimal list-inside" style={{color: '#473C8B'}}>
                  <li><strong>Click "Start AR Experience"</strong> button</li>
                  <li><strong>Allow camera permission</strong> if prompted</li>
                  <li><strong>Move device slowly</strong> to scan the environment</li>
                  <li><strong>Wait for green "Surface Found"</strong> message</li>
                  <li><strong>Tap screen</strong> to place the crocodile</li>
                  <li><strong>Place multiple times</strong> - old model auto-removes</li>
                </ol>
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

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
