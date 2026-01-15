import React, { useState, useEffect, useRef } from 'react';
import './CountingSort.css';
import AnimationControls from './AnimationControls';

// Generate counting sort steps
function generateCountingSortSteps(array) {
  const steps = [];
  const arr = [...array];
  
  steps.push({ action: 'init', array: [...arr], message: 'Starting Counting Sort' });

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  steps.push({
    action: 'info',
    array: [...arr],
    message: `Range: ${min} to ${max}, Count array size: ${range}`
  });

  // Initialize count array
  const count = new Array(range).fill(0);
  
  steps.push({
    action: 'initCount',
    count: [...count],
    array: [...arr],
    message: 'Initialized count array'
  });

  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    const countIndex = arr[i] - min;
    count[countIndex]++;
    
    steps.push({
      action: 'counting',
      arrayIndex: i,
      value: arr[i],
      countIndex: countIndex,
      count: [...count],
      array: [...arr],
      message: `Counted ${arr[i]} (count[${countIndex}] = ${count[countIndex]})`
    });
  }

  steps.push({
    action: 'countComplete',
    count: [...count],
    array: [...arr],
    message: 'Finished counting all elements'
  });

  // Cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
    
    steps.push({
      action: 'cumulative',
      index: i,
      count: [...count],
      array: [...arr],
      message: `Cumulative count[${i}] = ${count[i]}`
    });
  }

  steps.push({
    action: 'cumulativeComplete',
    count: [...count],
    array: [...arr],
    message: 'Cumulative count complete - these are final positions'
  });

  // Build output array
  const output = new Array(arr.length);
  
  for (let i = arr.length - 1; i >= 0; i--) {
    const countIndex = arr[i] - min;
    const outputPosition = count[countIndex] - 1;
    output[outputPosition] = arr[i];
    count[countIndex]--;
    
    steps.push({
      action: 'place',
      arrayIndex: i,
      value: arr[i],
      outputPosition: outputPosition,
      count: [...count],
      output: [...output],
      array: [...arr],
      message: `Placed ${arr[i]} at position ${outputPosition}`
    });
  }

  steps.push({
    action: 'copyBack',
    output: [...output],
    array: [...arr],
    message: 'Copying sorted array back'
  });

  // Copy back to original array
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }

  steps.push({ action: 'complete', array: [...arr], message: 'Counting Sort Complete!' });

  return steps;
}

function CountingSort() {
  const [inputValue, setInputValue] = useState('4, 2, 2, 8, 3, 3, 1, 7, 4');
  const [array, setArray] = useState([4, 2, 2, 8, 3, 3, 1, 7, 4]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [highlightType, setHighlightType] = useState('');
  const [countArray, setCountArray] = useState([]);
  const [outputArray, setOutputArray] = useState([]);
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateCountingSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setHighlightIndex(-1);
    setHighlightType('');
    setCountArray([]);
    setOutputArray([]);
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
      .filter(n => !isNaN(n) && n >= 0);
    
    if (numbers.length > 0) {
      setArray(numbers);
      setSteps([]);
      setCurrentStep(0);
      setHighlightIndex(-1);
      setCountArray([]);
      setOutputArray([]);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'initCount') {
      setCountArray(step.count);
      setHighlightIndex(-1);
      setHighlightType('');
    } else if (step.action === 'counting') {
      setHighlightIndex(step.arrayIndex);
      setHighlightType('counting');
      setCountArray(step.count);
    } else if (step.action === 'countComplete') {
      setCountArray(step.count);
      setHighlightIndex(-1);
      setHighlightType('');
    } else if (step.action === 'cumulative') {
      setCountArray(step.count);
      setHighlightType('cumulative');
    } else if (step.action === 'place') {
      setHighlightIndex(step.outputPosition);
      setHighlightType('place');
      setCountArray(step.count);
      setOutputArray(step.output);
    } else if (step.action === 'copyBack') {
      setOutputArray(step.output);
      setHighlightIndex(-1);
      setHighlightType('');
    } else if (step.action === 'complete') {
      setArray(step.array);
      setHighlightIndex(-1);
      setHighlightType('');
      setCountArray([]);
      setOutputArray([]);
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
    setHighlightIndex(-1);
    setHighlightType('');
    setCountArray([]);
    setOutputArray([]);
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getBarColor = (index) => {
    if (currentStep >= steps.length - 1) return '#4ade80';
    if (index === highlightIndex) {
      if (highlightType === 'counting') return '#fbbf24';
      if (highlightType === 'place') return '#3b82f6';
    }
    return '#94a3b8';
  };

  const maxValue = Math.max(...array, 100);
  const minValue = Math.min(...array);

  return (
    <div className="counting-sort-container">
      <div className="algorithm-info">
        <h2>Counting Sort</h2>
        <p>
          Counting Sort is an efficient non-comparative sorting algorithm for integers with a limited range.
          It counts the frequency of each element, then uses cumulative counts to place elements in sorted order.
          Time complexity: O(n + k) where k is the range of input.
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter small positive numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 4, 2, 2, 8, 3"
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

      {countArray.length > 0 && (
        <div className="count-array-display">
          <h3>Count Array</h3>
          <div className="count-grid">
            {countArray.map((count, index) => (
              <div key={index} className="count-cell">
                <div className="count-index">{index + minValue}</div>
                <div className="count-value">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outputArray.length > 0 && (
        <div className="output-array-display">
          <h3>Output Array (Building)</h3>
          <div className="output-grid">
            {outputArray.map((value, index) => (
              <div 
                key={index} 
                className={`output-cell ${index === highlightIndex ? 'highlight' : ''}`}
              >
                {value !== undefined ? value : '—'}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#94a3b8' }}></div>
          <span>Unsorted</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Counting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Placing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}

export default CountingSort;
