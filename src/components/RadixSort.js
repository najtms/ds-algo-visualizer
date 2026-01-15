import React, { useState, useEffect, useRef } from 'react';
import './RadixSort.css';
import AnimationControls from './AnimationControls';

// Generate radix sort steps (LSD - Least Significant Digit)
function generateRadixSortSteps(array) {
  const steps = [];
  const arr = [...array];
  
  steps.push({ action: 'init', array: [...arr], message: 'Starting Radix Sort (LSD)' });

  const max = Math.max(...arr);
  const maxDigits = max.toString().length;

  steps.push({
    action: 'info',
    array: [...arr],
    message: `Maximum value: ${max}, Total passes: ${maxDigits}`
  });

  for (let digitPlace = 1; Math.floor(max / digitPlace) > 0; digitPlace *= 10) {
    const digit = Math.log10(digitPlace);
    
    steps.push({
      action: 'newPass',
      digitPlace: digitPlace,
      array: [...arr],
      message: `Sorting by digit at position ${digit} (place value: ${digitPlace})`
    });

    const buckets = Array.from({ length: 10 }, () => []);

    // Distribute into buckets
    for (let i = 0; i < arr.length; i++) {
      const bucketIndex = Math.floor(arr[i] / digitPlace) % 10;
      
      steps.push({
        action: 'distribute',
        index: i,
        value: arr[i],
        bucket: bucketIndex,
        digitPlace: digitPlace,
        array: [...arr],
        message: `Placing ${arr[i]} into bucket ${bucketIndex} (digit: ${bucketIndex})`
      });

      buckets[bucketIndex].push(arr[i]);
    }

    steps.push({
      action: 'showBuckets',
      buckets: buckets.map(b => [...b]),
      digitPlace: digitPlace,
      array: [...arr],
      message: `All elements distributed into buckets`
    });

    // Collect from buckets
    let index = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        arr[index] = buckets[i][j];
        
        steps.push({
          action: 'collect',
          fromBucket: i,
          toIndex: index,
          value: buckets[i][j],
          digitPlace: digitPlace,
          array: [...arr],
          message: `Collecting ${buckets[i][j]} from bucket ${i} to position ${index}`
        });

        index++;
      }
    }

    steps.push({
      action: 'passComplete',
      digitPlace: digitPlace,
      array: [...arr],
      message: `Completed pass for digit position ${digit}`
    });
  }

  steps.push({ action: 'complete', array: [...arr], message: 'Radix Sort Complete!' });

  return steps;
}

function RadixSort() {
  const [inputValue, setInputValue] = useState('170, 45, 75, 90, 802, 24, 2, 66');
  const [array, setArray] = useState([170, 45, 75, 90, 802, 24, 2, 66]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentDigitPlace, setCurrentDigitPlace] = useState(1);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [highlightType, setHighlightType] = useState('');
  const [currentBuckets, setCurrentBuckets] = useState([]);
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateRadixSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setCurrentDigitPlace(1);
    setHighlightIndex(-1);
    setHighlightType('');
    setCurrentBuckets([]);
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
      setCurrentDigitPlace(1);
      setHighlightIndex(-1);
      setCurrentBuckets([]);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'newPass') {
      setCurrentDigitPlace(step.digitPlace);
      setHighlightIndex(-1);
      setHighlightType('');
      setCurrentBuckets([]);
    } else if (step.action === 'distribute') {
      setHighlightIndex(step.index);
      setHighlightType('distribute');
      setCurrentDigitPlace(step.digitPlace);
    } else if (step.action === 'showBuckets') {
      setCurrentBuckets(step.buckets);
      setHighlightIndex(-1);
      setHighlightType('');
    } else if (step.action === 'collect') {
      setHighlightIndex(step.toIndex);
      setHighlightType('collect');
      setArray(step.array);
    } else if (step.action === 'passComplete') {
      setHighlightIndex(-1);
      setHighlightType('');
      setCurrentBuckets([]);
    } else if (step.action === 'complete') {
      setHighlightIndex(-1);
      setHighlightType('');
      setCurrentBuckets([]);
      setCurrentDigitPlace(1);
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
    setCurrentDigitPlace(1);
    setHighlightIndex(-1);
    setHighlightType('');
    setCurrentBuckets([]);
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getBarColor = (index) => {
    if (currentStep >= steps.length - 1) return '#4ade80'; // sorted
    if (index === highlightIndex) {
      if (highlightType === 'distribute') return '#fbbf24'; // yellow
      if (highlightType === 'collect') return '#3b82f6'; // blue
    }
    return '#94a3b8'; // gray
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="radix-sort-container">
      <div className="algorithm-info">
        <h2>Radix Sort (LSD)</h2>
        <p>
          Radix Sort is a non-comparative sorting algorithm that sorts numbers digit by digit, starting from the 
          Least Significant Digit (LSD). It uses counting sort as a subroutine. Time complexity: O(d × n) where d is the number of digits.
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter positive numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 170, 45, 75, 90"
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

      {currentDigitPlace > 0 && (
        <div className="digit-info">
          <span>Current Digit Place: <strong>{currentDigitPlace}</strong></span>
        </div>
      )}

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

      {currentBuckets.length > 0 && (
        <div className="buckets-display">
          <h3>Buckets (0-9)</h3>
          <div className="buckets-grid">
            {currentBuckets.map((bucket, index) => (
              <div key={index} className="bucket">
                <div className="bucket-label">Bucket {index}</div>
                <div className="bucket-content">
                  {bucket.length > 0 ? bucket.join(', ') : '—'}
                </div>
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
          <span>Distributing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Collecting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}

export default RadixSort;
