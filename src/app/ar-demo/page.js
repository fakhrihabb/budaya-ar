'use client';

import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { SceneManager } from '@/lib/sceneManager';
import { generateTestAudio } from '@/lib/audioUtils';
import './ar-demo.css';

export default function ARDemo() {
  const [state, setState] = useState('LOADING');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [arSupported, setArSupported] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  
  const sceneManagerRef = useRef(null);
  const xrSessionRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const audioRef = useRef(null);
  const subtitlesRef = useRef([]);
  const reticleRef = useRef(null);
  const hitTestSourceRef = useRef(null);
  const placedAnchorRef = useRef(null);
  const modelsRef = useRef([]);
  const xrFrameLoopRef = useRef(null);

  useEffect(() => {
    // Check WebXR support
    if (!navigator.xr) {
      setArSupported(false);
      console.warn('WebXR is not supported on this device');
      return;
    }

    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
      setArSupported(supported);
      if (!supported) {
        console.warn('immersive-ar is not supported');
      }
    });

    // Initialize Scene Manager
    const sceneManager = new SceneManager();
    sceneManagerRef.current = sceneManager;

    // Listen for state changes
    sceneManager.on('stateChanged', ({ newState }) => {
      setState(newState);
    });

    // Listen for loading progress
    sceneManager.on('loadingProgressChanged', (progress) => {
      setLoadingProgress(progress);
    });

    // Start loading assets
    const loadAssets = async () => {
      await sceneManager.simulateAssetLoading();
      
      // Initialize audio
      const audioUrl = await generateTestAudio();
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', handleAudioEnded);
      audioRef.current.addEventListener('timeupdate', handleAudioTimeUpdate);

      // Load subtitles
      subtitlesRef.current = [
        { text: 'Welcome to the AR experience', start: 0, end: 3 },
        { text: 'This is a 3D scene placed on your surface', start: 3, end: 6 },
        { text: 'Enjoy this interactive story', start: 6, end: 9 },
      ];

      sceneManager.setState('INSTRUCTIONS');
    };

    loadAssets();

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.removeEventListener('timeupdate', handleAudioTimeUpdate);
      }
    };
  }, []);

  const handleAudioEnded = () => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.onAudioEnded();
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current && subtitlesRef.current) {
      const currentTime = audioRef.current.currentTime;
      const subtitle = subtitlesRef.current.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      setCurrentSubtitle(subtitle ? subtitle.text : '');
    }
  };

  const handleStartAR = async () => {
    if (!navigator.xr) {
      alert('WebXR is not supported on your device');
      return;
    }

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'dom-overlay-for-handheld-ar'],
      });

      xrSessionRef.current = session;

      // Initialize Three.js scene
      initializeThreeJS(session);

      // Set up hit-test
      setupHitTest(session);

      // Handle screen tap
      session.addEventListener('select', handleARScreenTap);

      // Transition to scanning state
      if (sceneManagerRef.current) {
        sceneManagerRef.current.onStartARClick();
      }

      // Start render loop
      const onXRFrame = (time, frame) => {
        xrFrameLoopRef.current = frame.session.requestAnimationFrame(onXRFrame);
        handleXRFrame(time, frame);
      };

      session.requestAnimationFrame(onXRFrame);
    } catch (err) {
      console.error('Failed to start AR session:', err);
      alert('Failed to start AR session. ' + err.message);
    }
  };

  const initializeThreeJS = (session) => {
    const canvas = canvasRef.current;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas });
    renderer.xr.enabled = true;
    renderer.xr.setSession(session);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // Add lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Create reticle (a simple ring that appears on hit-test surface)
    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32);
    const reticleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8,
    });
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.rotation.x = -Math.PI / 2;
    reticle.visible = false;
    scene.add(reticle);
    reticleRef.current = reticle;

    // Handle window resize
    const handleWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleWindowResize);

    return { scene, camera, renderer };
  };

  const setupHitTest = async (session) => {
    try {
      const space = await session.requestReferenceSpace('viewer');
      const source = await session.requestHitTestSource({ space });
      hitTestSourceRef.current = source;
    } catch (err) {
      console.error('Failed to set up hit test:', err);
    }
  };

  const handleARScreenTap = () => {
    if (sceneManagerRef.current && state === 'SCANNING_FOR_SURFACE') {
      // Place the scene
      placeScene();
      sceneManagerRef.current.onScreenTap();
      
      // Start playing audio
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error('Failed to play audio:', err);
        });
      }
    }
  };

  const placeScene = () => {
    if (!reticleRef.current || !sceneRef.current) return;

    const position = reticleRef.current.position.clone();
    
    // Create sample 3D models (simple cubes for demo)
    const models = [];
    
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 3, 0.8, 0.6),
      });
      const cube = new THREE.Mesh(geometry, material);
      
      // Position cubes in a row
      cube.position.copy(position);
      cube.position.x += (i - 1) * 0.3;
      cube.position.y += 0.1;
      
      sceneRef.current.add(cube);
      models.push(cube);
    }

    modelsRef.current = models;
  };

  const handleXRFrame = (time, frame) => {
    const session = frame.session;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    // Handle hit test for reticle position
    if (hitTestSourceRef.current && state === 'SCANNING_FOR_SURFACE') {
      try {
        const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
        
        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(frame.getReferenceSpace('viewer'));
          
          if (pose && reticleRef.current) {
            reticleRef.current.visible = true;
            reticleRef.current.matrix.fromArray(pose.transform.matrix);
            reticleRef.current.matrixAutoUpdate = false;
          }
        } else if (reticleRef.current) {
          reticleRef.current.visible = false;
        }
      } catch (err) {
        console.error('Hit test error:', err);
      }
    }

    // Animate models if scene is playing
    if (state === 'PLAYING_SCENE' && modelsRef.current.length > 0) {
      modelsRef.current.forEach((model) => {
        model.rotation.x += 0.005;
        model.rotation.y += 0.008;
      });
    }

    // Render the scene
    renderer.render(scene, camera);
  };

  const handleClose = () => {
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Cancel animation frame
    if (xrFrameLoopRef.current) {
      xrSessionRef.current?.cancelAnimationFrame(xrFrameLoopRef.current);
    }

    // End AR session
    if (xrSessionRef.current) {
      xrSessionRef.current.end().catch(err => {
        console.error('Error ending session:', err);
      });
    }

    // Return to home page
    window.location.href = '/';
  };

  return (
    <div className="ar-demo-container">
      {/* Loading Screen */}
      {state === 'LOADING' && (
        <div className="screen loading-screen">
          <div className="screen-content">
            <h1>Loading Demo...</h1>
            <div className="spinner"></div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${loadingProgress}%` }}></div>
            </div>
            <p className="progress-text">{Math.round(loadingProgress)}%</p>
          </div>
        </div>
      )}

      {/* Instructions Screen */}
      {state === 'INSTRUCTIONS' && (
        <div className="screen instructions-screen">
          <div className="screen-content">
            <h1>Ready to Start?</h1>
            <div className="instructions-box">
              {arSupported ? (
                <>
                  <p>📱 Point your camera to a flat surface</p>
                  <p>✨ A reticle will appear on the surface</p>
                  <p>👆 Tap to place the 3D scene</p>
                  <p>🎵 Enjoy the interactive experience</p>
                </>
              ) : (
                <>
                  <p>⚠️ WebXR is not fully supported</p>
                  <p>Your device may not support AR features</p>
                </>
              )}
            </div>
            <button
              className="btn-primary"
              onClick={handleStartAR}
              disabled={!arSupported}
            >
              {arSupported ? 'Start AR' : 'AR Not Supported'}
            </button>
          </div>
        </div>
      )}

      {/* AR Canvas */}
      <canvas
        ref={canvasRef}
        className="ar-canvas"
        style={{ display: state === 'SCANNING_FOR_SURFACE' || state === 'PLAYING_SCENE' ? 'block' : 'none' }}
      />

      {/* Scanning Screen Overlay */}
      {state === 'SCANNING_FOR_SURFACE' && (
        <div className="scanning-overlay">
          <p className="scanning-text">Move your phone to find a surface...</p>
          <p className="scanning-hint">Tap when ready</p>
          <div className="back-button-container">
            <button className="btn-back" onClick={handleClose}>
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Playing Scene Overlay */}
      {state === 'PLAYING_SCENE' && (
        <div className="scene-overlay">
          <div className="subtitles-container">
            <p className="subtitle">{currentSubtitle}</p>
          </div>
        </div>
      )}

      {/* Finished Screen */}
      {state === 'FINISHED' && (
        <div className="screen finished-screen">
          <div className="screen-content">
            <h1>✨ Story is Finished</h1>
            <p className="finished-message">Thank you for experiencing our AR demo!</p>
            <button className="btn-primary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
