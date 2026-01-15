import React, { useState, useEffect, useRef } from 'react';
import './BubbleSort.css';
import AnimationControls from './AnimationControls';

// Generate bubble sort steps
function generateBubbleSortSteps(array) {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({ action: 'init', array: [...arr], message: 'Starting Bubble Sort' });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      steps.push({
        action: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        message: `Comparing ${arr[j]} and ${arr[j + 1]}`
      });

      if (arr[j] > arr[j + 1]) {
        // Swap step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          action: 'swap',
          indices: [j, j + 1],
          array: [...arr],
          message: `Swapped ${arr[j + 1]} and ${arr[j]}`
        });
      }
    }
    // Mark as sorted
    steps.push({
      action: 'sorted',
      index: n - i - 1,
      array: [...arr],
      message: `Position ${n - i - 1} is sorted`
    });
  }

  steps.push({
    action: 'sorted',
    index: 0,
    array: [...arr],
    message: 'Array is fully sorted!'
  });

  steps.push({ action: 'complete', array: [...arr], message: 'Bubble Sort Complete!' });

  return steps;
}

function BubbleSort() {
  const [inputValue, setInputValue] = useState('64, 34, 25, 12, 22, 11, 90');
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  // Generate steps from current array
  const handleGenerateSteps = () => {
    const newSteps = generateBubbleSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setSortedIndices(new Set());
    setHighlightIndices([]);
    setHighlightType('');
    setIsPlaying(false);
    setMessage(newSteps[0]?.message || 'Ready to start');
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Parse and set array
  const handleSetArray = () => {
    const numbers = inputValue
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    if (numbers.length > 0) {
      setArray(numbers);
      setSteps([]);
      setCurrentStep(0);
      setSortedIndices(new Set());
      setHighlightIndices([]);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  // Execute current step
  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'compare') {
      setHighlightIndices(step.indices);
      setHighlightType('compare');
    } else if (step.action === 'swap') {
      setHighlightIndices(step.indices);
      setHighlightType('swap');
      setArray(step.array);
    } else if (step.action === 'sorted') {
      setSortedIndices(prev => new Set([...prev, step.index]));
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'complete') {
      setHighlightIndices([]);
      setHighlightType('');
      const allIndices = new Set(array.map((_, i) => i));
      setSortedIndices(allIndices);
    }
  }, [currentStep, steps]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      animationRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  // Control handlers
  const handlePlay = () => {
    if (steps.length === 0) {
      handleGenerateSteps();
    } else if (currentStep < steps.length - 1) {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSortedIndices(new Set());
    setHighlightIndices([]);
    setHighlightType('');
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  // Get bar color
  const getBarColor = (index) => {
    if (sortedIndices.has(index)) return '#4ade80'; // green
    if (highlightIndices.includes(index)) {
      if (highlightType === 'compare') return '#fbbf24'; // yellow
      if (highlightType === 'swap') return '#3b82f6'; // blue
    }
    return '#94a3b8'; // gray
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="bubble-sort-container">
      <div className="algorithm-info">
        <h2>Bubble Sort</h2>
        <p>
          Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 64, 34, 25, 12"
          />
        </label>
        <button onClick={handleSetArray} className="btn-secondary">
          Set Array
        </button>
        <button onClick={handleGenerateSteps} className="btn-primary">
          Generate Steps
        </button>
      </div>

      <AnimationControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
        speed={speed}
        currentStep={currentStep}
        totalSteps={steps.length}
        disabled={steps.length === 0}
      />

      <div className="message-box">
        {message}
      </div>

      <div className="visualization">
        <div className="bars-container">
          {array.map((value, index) => (
            <div key={index} className="bar-wrapper">
              <div
                className="bar"
                style={{
                  height: `${(value / maxValue) * 300}px`,
                  backgroundColor: getBarColor(index),
                }}
              >
                <span className="bar-value">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#94a3b8' }}></div>
          <span>Unsorted</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Swapping</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}

export default BubbleSort;
