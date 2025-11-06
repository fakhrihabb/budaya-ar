/**
 * Scene Manager - A state machine for managing the AR experience
 * States: LOADING, INSTRUCTIONS, SCANNING_FOR_SURFACE, PLAYING_SCENE, FINISHED
 */

export class SceneManager {
  constructor() {
    this.currentState = 'LOADING';
    this.assets = {
      models: [],
      audio: null,
      subtitles: null,
    };
    this.loadingProgress = 0;
    this.callbacks = {};
  }

  /**
   * Register a callback for state transitions
   * @param {string} event - Event name (e.g., 'onAssetsLoaded', 'onStartARClick')
   * @param {Function} callback - Function to call
   */
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  /**
   * Emit an event and call all registered callbacks
   * @param {string} event - Event name
   * @param {*} data - Data to pass to callbacks
   */
  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  /**
   * Transition to a new state
   * @param {string} newState - New state
   */
  setState(newState) {
    const oldState = this.currentState;
    this.currentState = newState;
    this.emit('stateChanged', { oldState, newState });
  }

  /**
   * Get the current state
   * @returns {string} Current state
   */
  getState() {
    return this.currentState;
  }

  /**
   * Update loading progress (0-100)
   * @param {number} progress - Progress percentage
   */
  setLoadingProgress(progress) {
    this.loadingProgress = Math.min(100, Math.max(0, progress));
    this.emit('loadingProgressChanged', this.loadingProgress);
  }

  /**
   * Simulate asset loading with loading progress
   * Returns a promise that resolves when all assets are "loaded"
   * @returns {Promise<void>}
   */
  simulateAssetLoading() {
    return new Promise((resolve) => {
      const steps = 10;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = (currentStep / steps) * 100;
        this.setLoadingProgress(progress);

        if (currentStep >= steps) {
          clearInterval(interval);
          this.assets.audio = true; // Simulated
          this.assets.models = [1, 2, 3]; // Simulated
          this.assets.subtitles = []; // Simulated
          resolve();
        }
      }, 300);
    });
  }

  /**
   * Handle the "Start AR" button click
   */
  onStartARClick() {
    this.setState('SCANNING_FOR_SURFACE');
    this.emit('startARSession');
  }

  /**
   * Handle screen tap during scanning
   */
  onScreenTap(hitTestResult) {
    this.setState('PLAYING_SCENE');
    this.emit('placeScene', hitTestResult);
  }

  /**
   * Handle audio end
   */
  onAudioEnded() {
    this.setState('FINISHED');
    this.emit('sceneFinished');
  }
}

export default SceneManager;
