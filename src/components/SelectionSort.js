import React, { useState, useEffect, useRef } from 'react';
import './SelectionSort.css';
import AnimationControls from './AnimationControls';

// Generate selection sort steps
function generateSelectionSortSteps(array) {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({ action: 'init', array: [...arr], message: 'Starting Selection Sort' });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    steps.push({
      action: 'select',
      index: i,
      array: [...arr],
      message: `Finding minimum from position ${i}`
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        action: 'compare',
        indices: [minIndex, j],
        array: [...arr],
        message: `Comparing ${arr[minIndex]} with ${arr[j]}`
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push({
          action: 'newMin',
          index: minIndex,
          array: [...arr],
          message: `New minimum found: ${arr[minIndex]}`
        });
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push({
        action: 'swap',
        indices: [i, minIndex],
        array: [...arr],
        message: `Swapped ${arr[minIndex]} with ${arr[i]}`
      });
    }

    steps.push({
      action: 'sorted',
      index: i,
      array: [...arr],
      message: `Position ${i} is sorted`
    });
  }

  steps.push({
    action: 'sorted',
    index: n - 1,
    array: [...arr],
    message: 'Array is fully sorted!'
  });

  steps.push({ action: 'complete', array: [...arr], message: 'Selection Sort Complete!' });

  return steps;
}

function SelectionSort() {
  const [inputValue, setInputValue] = useState('64, 25, 12, 22, 11');
  const [array, setArray] = useState([64, 25, 12, 22, 11]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [minIndex, setMinIndex] = useState(-1);
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateSelectionSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setSortedIndices(new Set());
    setHighlightIndices([]);
    setHighlightType('');
    setCurrentIndex(-1);
    setMinIndex(-1);
    setIsPlaying(false);
    setMessage(newSteps[0]?.message || 'Ready to start');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

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
      setCurrentIndex(-1);
      setMinIndex(-1);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'select') {
      setCurrentIndex(step.index);
      setMinIndex(step.index);
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'compare') {
      setHighlightIndices(step.indices);
      setHighlightType('compare');
    } else if (step.action === 'newMin') {
      setMinIndex(step.index);
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'swap') {
      setHighlightIndices(step.indices);
      setHighlightType('swap');
      setArray(step.array);
    } else if (step.action === 'sorted') {
      setSortedIndices(prev => new Set([...prev, step.index]));
      setHighlightIndices([]);
      setHighlightType('');
      setCurrentIndex(-1);
      setMinIndex(-1);
    } else if (step.action === 'complete') {
      setHighlightIndices([]);
      setHighlightType('');
      setCurrentIndex(-1);
      setMinIndex(-1);
      const allIndices = new Set(array.map((_, i) => i));
      setSortedIndices(allIndices);
    }
  }, [currentStep, steps]);

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
    setCurrentIndex(-1);
    setMinIndex(-1);
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getBarColor = (index) => {
    if (sortedIndices.has(index)) return '#4ade80'; // green
    if (index === minIndex && minIndex !== -1) return '#f97316'; // orange - current minimum
    if (index === currentIndex) return '#8b5cf6'; // purple - current position
    if (highlightIndices.includes(index)) {
      if (highlightType === 'compare') return '#fbbf24'; // yellow
      if (highlightType === 'swap') return '#3b82f6'; // blue
    }
    return '#94a3b8'; // gray
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="selection-sort-container">
      <div className="algorithm-info">
        <h2>Selection Sort</h2>
        <p>
          Selection Sort repeatedly finds the minimum element from the unsorted portion and places it at the beginning.
          It divides the array into sorted and unsorted regions.
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 64, 25, 12, 22"
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
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Current Position</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
          <span>Current Min</span>
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

export default SelectionSort;
