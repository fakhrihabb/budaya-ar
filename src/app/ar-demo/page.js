'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { SceneManager } from '@/lib/sceneManager';
import './ar-demo.css';

export default function ARDemo() {
  const [state, setState] = useState('LOADING');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const sceneManagerRef = useRef(null);

  useEffect(() => {
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
      sceneManager.setState('INSTRUCTIONS');
    };

    loadAssets();
  }, []);

  const handleStartAR = () => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.onStartARClick();
    }
  };

  const handleClose = () => {
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
              <p>📱 Point your camera to a flat surface</p>
              <p>✨ A reticle will appear on the surface</p>
              <p>👆 Tap to place the 3D scene</p>
              <p>🎵 Enjoy the interactive experience</p>
            </div>
            <button className="btn-primary" onClick={handleStartAR}>
              Start AR
            </button>
          </div>
        </div>
      )}

      {/* Scanning Screen */}
      {state === 'SCANNING_FOR_SURFACE' && (
        <div className="screen scanning-screen">
          <div className="ar-content">
            <canvas id="ar-canvas" className="ar-canvas"></canvas>
            <div className="scanning-overlay">
              <div className="reticle"></div>
              <p className="scanning-text">Move your phone to find a surface...</p>
              <p className="scanning-hint">Tap when ready</p>
            </div>
          </div>
          <div className="back-button-container">
            <button className="btn-back" onClick={handleClose}>
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Playing Scene Screen */}
      {state === 'PLAYING_SCENE' && (
        <div className="screen playing-screen">
          <div className="ar-content">
            <canvas id="ar-canvas" className="ar-canvas"></canvas>
            <div className="scene-overlay">
              <div className="subtitles-container">
                <p className="subtitle">Scene is playing... 🎬</p>
              </div>
            </div>
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
