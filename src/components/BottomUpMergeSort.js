import React, { useState, useEffect, useRef } from 'react';
import './BottomUpMergeSort.css';
import AnimationControls from './AnimationControls';

// Generate bottom-up merge sort steps
function generateBottomUpMergeSortSteps(array) {
  const steps = [];
  const arr = [...array];
  const n = arr.length;
  
  steps.push({ action: 'init', array: [...arr], message: 'Starting Bottom-Up Merge Sort' });

  function merge(arr, left, mid, right) {
    const leftArr = [];
    const rightArr = [];

    for (let i = left; i <= mid; i++) leftArr.push(arr[i]);
    for (let i = mid + 1; i <= right; i++) rightArr.push(arr[i]);

    steps.push({
      action: 'mergeStart',
      left: left,
      mid: mid,
      right: right,
      array: [...arr],
      message: `Merging [${left}...${mid}] and [${mid + 1}...${right}]`
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        action: 'compare',
        indices: [left + i, mid + 1 + j],
        array: [...arr],
        message: `Comparing ${leftArr[i]} and ${rightArr[j]}`
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        steps.push({
          action: 'place',
          index: k,
          value: leftArr[i],
          array: [...arr],
          message: `Placed ${leftArr[i]} at position ${k}`
        });
        i++;
      } else {
        arr[k] = rightArr[j];
        steps.push({
          action: 'place',
          index: k,
          value: rightArr[j],
          array: [...arr],
          message: `Placed ${rightArr[j]} at position ${k}`
        });
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        action: 'place',
        index: k,
        value: leftArr[i],
        array: [...arr],
        message: `Placed remaining ${leftArr[i]}`
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        action: 'place',
        index: k,
        value: rightArr[j],
        array: [...arr],
        message: `Placed remaining ${rightArr[j]}`
      });
      j++;
      k++;
    }

    steps.push({
      action: 'merged',
      left: left,
      right: right,
      array: [...arr],
      message: `Merged range [${left}...${right}]`
    });
  }

  // Bottom-up approach: start with size 1, double each iteration
  for (let size = 1; size < n; size *= 2) {
    steps.push({
      action: 'newPass',
      size: size,
      array: [...arr],
      message: `Starting pass with subarray size ${size}`
    });

    for (let left = 0; left < n - 1; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);
      
      if (mid < right) {
        merge(arr, left, mid, right);
      }
    }

    steps.push({
      action: 'passComplete',
      size: size,
      array: [...arr],
      message: `Completed pass with size ${size}`
    });
  }

  steps.push({ action: 'complete', array: [...arr], message: 'Bottom-Up Merge Sort Complete!' });

  return steps;
}

function BottomUpMergeSort() {
  const [inputValue, setInputValue] = useState('14, 33, 27, 10, 35, 19, 42, 44');
  const [array, setArray] = useState([14, 33, 27, 10, 35, 19, 42, 44]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentSize, setCurrentSize] = useState(0);
  const [activeRange, setActiveRange] = useState({ left: -1, right: -1 });
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [mergedRanges, setMergedRanges] = useState([]);
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateBottomUpMergeSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setCurrentSize(0);
    setActiveRange({ left: -1, right: -1 });
    setHighlightIndices([]);
    setHighlightType('');
    setMergedRanges([]);
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
      setCurrentSize(0);
      setActiveRange({ left: -1, right: -1 });
      setHighlightIndices([]);
      setMergedRanges([]);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'newPass') {
      setCurrentSize(step.size);
      setHighlightIndices([]);
      setHighlightType('');
      setMergedRanges([]);
    } else if (step.action === 'mergeStart') {
      setActiveRange({ left: step.left, right: step.right });
      setHighlightIndices([]);
      setHighlightType('merge');
    } else if (step.action === 'compare') {
      setHighlightIndices(step.indices);
      setHighlightType('compare');
    } else if (step.action === 'place') {
      setHighlightIndices([step.index]);
      setHighlightType('place');
      setArray(step.array);
    } else if (step.action === 'merged') {
      setMergedRanges(prev => [...prev, { left: step.left, right: step.right }]);
      setHighlightIndices([]);
      setHighlightType('');
      setActiveRange({ left: -1, right: -1 });
    } else if (step.action === 'passComplete') {
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'complete') {
      setCurrentSize(0);
      setHighlightIndices([]);
      setHighlightType('');
      setActiveRange({ left: -1, right: -1 });
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
    setCurrentSize(0);
    setActiveRange({ left: -1, right: -1 });
    setHighlightIndices([]);
    setHighlightType('');
    setMergedRanges([]);
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const isInMergedRange = (index) => {
    return mergedRanges.some(range => index >= range.left && index <= range.right);
  };

  const getBarColor = (index) => {
    if (currentStep >= steps.length - 1) return '#4ade80';
    if (highlightIndices.includes(index)) {
      if (highlightType === 'compare') return '#fbbf24';
      if (highlightType === 'place') return '#3b82f6';
    }
    if (index >= activeRange.left && index <= activeRange.right && activeRange.left !== -1) {
      return '#f97316';
    }
    if (isInMergedRange(index)) return '#4ade80';
    return '#94a3b8';
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="bottom-up-merge-sort-container">
      <div className="algorithm-info">
        <h2>Bottom-Up Merge Sort</h2>
        <p>
          Bottom-Up Merge Sort is an iterative version of Merge Sort. Instead of recursively dividing, 
          it starts with subarrays of size 1 and iteratively merges them: size 1→2→4→8... until the entire array is sorted.
          No recursion, just iteration!
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 14, 33, 27, 10"
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

      {currentSize > 0 && (
        <div className="size-info">
          <span>Current Subarray Size: <strong>{currentSize}</strong></span>
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

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#94a3b8' }}></div>
          <span>Unsorted</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
          <span>Active Range</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Placing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Merged</span>
        </div>
      </div>
    </div>
  );
}

export default BottomUpMergeSort;
