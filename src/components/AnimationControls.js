import React from 'react';
import './AnimationControls.css';

function AnimationControls({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onReset,
  onSpeedChange,
  speed,
  currentStep,
  totalSteps,
  disabled = false
}) {
  const handleSpeedChange = (e) => {
    const speedValue = parseInt(e.target.value);
    // Convert slider value to delay (inverse relationship)
    // Slider: 1 (slow) to 5 (fast)
    // Delay: 2000ms to 200ms
    const delay = 2200 - (speedValue * 400);
    onSpeedChange(delay);
  };

  const getSpeedLabel = () => {
    if (speed >= 1800) return 'Slow';
    if (speed >= 1200) return 'Normal';
    if (speed >= 600) return 'Fast';
    return 'Very Fast';
  };

  const getSliderValue = () => {
    // Convert delay back to slider value
    return Math.round((2200 - speed) / 400);
  };

  return (
    <div className="animation-controls">
      <div className="control-buttons">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled}
          className="control-btn play-pause"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button
          onClick={onStepForward}
          disabled={disabled || isPlaying || currentStep >= totalSteps - 1}
          className="control-btn"
          title="Step Forward"
        >
          ⏭
        </button>
        
        <button
          onClick={onReset}
          disabled={disabled}
          className="control-btn"
          title="Reset"
        >
          🔁
        </button>
      </div>

      <div className="speed-control">
        <label>Speed: <span className="speed-label">{getSpeedLabel()}</span></label>
        <input
          type="range"
          min="1"
          max="5"
          value={getSliderValue()}
          onChange={handleSpeedChange}
          disabled={disabled}
          className="speed-slider"
        />
      </div>

      <div className="progress-info">
        <span>Step {currentStep + 1} / {totalSteps || 0}</span>
      </div>
    </div>
  );
}

export default AnimationControls;
