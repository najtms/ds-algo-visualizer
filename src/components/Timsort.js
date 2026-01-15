import React, { useState, useEffect, useRef } from 'react';
import './Timsort.css';
import AnimationControls from './AnimationControls';

// Generate timsort steps (simplified version showing key concepts)
function generateTimsortSteps(array) {
  const steps = [];
  const arr = [...array];
  const RUN = 4; // Minimum run size for this visualization
  
  steps.push({ action: 'init', array: [...arr], message: 'Starting Timsort (Hybrid: Insertion + Merge)' });
  steps.push({ action: 'info', array: [...arr], message: `Using RUN size: ${RUN}` });

  // Sort individual runs using insertion sort
  function insertionSort(arr, left, right) {
    for (let i = left + 1; i <= right; i++) {
      const key = arr[i];
      let j = i - 1;
      
      steps.push({
        action: 'selectInRun',
        index: i,
        left: left,
        right: right,
        array: [...arr],
        message: `Insertion Sort: selecting ${key} in run [${left}...${right}]`
      });

      while (j >= left && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
      
      steps.push({
        action: 'insertInRun',
        index: j + 1,
        left: left,
        right: right,
        array: [...arr],
        message: `Inserted ${key} at position ${j + 1}`
      });
    }
    
    steps.push({
      action: 'runSorted',
      left: left,
      right: right,
      array: [...arr],
      message: `Run [${left}...${right}] is now sorted`
    });
  }

  // Merge function
  function merge(arr, left, mid, right) {
    const leftArr = [];
    const rightArr = [];

    for (let i = left; i <= mid; i++) leftArr.push(arr[i]);
    for (let i = mid + 1; i <= right; i++) rightArr.push(arr[i]);

    steps.push({
      action: 'mergeRuns',
      left: left,
      mid: mid,
      right: right,
      array: [...arr],
      message: `Merging runs [${left}...${mid}] and [${mid + 1}...${right}]`
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      
      steps.push({
        action: 'placeMerge',
        index: k,
        value: arr[k],
        array: [...arr],
        message: `Placed ${arr[k]} during merge`
      });
      
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        action: 'placeMerge',
        index: k,
        value: arr[k],
        array: [...arr],
        message: `Placed remaining ${arr[k]}`
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        action: 'placeMerge',
        index: k,
        value: arr[k],
        array: [...arr],
        message: `Placed remaining ${arr[k]}`
      });
      j++;
      k++;
    }

    steps.push({
      action: 'mergeComplete',
      left: left,
      right: right,
      array: [...arr],
      message: `Merged range [${left}...${right}]`
    });
  }

  const n = arr.length;

  // Phase 1: Sort individual runs
  steps.push({ 
    action: 'phase', 
    phase: 1,
    array: [...arr], 
    message: 'Phase 1: Sorting individual runs with Insertion Sort' 
  });

  for (let start = 0; start < n; start += RUN) {
    const end = Math.min(start + RUN - 1, n - 1);
    insertionSort(arr, start, end);
  }

  // Phase 2: Merge runs
  steps.push({ 
    action: 'phase', 
    phase: 2,
    array: [...arr], 
    message: 'Phase 2: Merging sorted runs' 
  });

  for (let size = RUN; size < n; size = 2 * size) {
    for (let start = 0; start < n; start += 2 * size) {
      const mid = start + size - 1;
      const end = Math.min(start + 2 * size - 1, n - 1);
      
      if (mid < end) {
        merge(arr, start, mid, end);
      }
    }
  }

  steps.push({ action: 'complete', array: [...arr], message: 'Timsort Complete!' });

  return steps;
}

function Timsort() {
  const [inputValue, setInputValue] = useState('5, 21, 7, 23, 19, 10, 28, 13, 3, 16, 8, 25');
  const [array, setArray] = useState([5, 21, 7, 23, 19, 10, 28, 13, 3, 16, 8, 25]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeRange, setActiveRange] = useState({ left: -1, right: -1 });
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [sortedRuns, setSortedRuns] = useState([]);
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateTimsortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setCurrentPhase(0);
    setActiveRange({ left: -1, right: -1 });
    setHighlightIndices([]);
    setHighlightType('');
    setSortedRuns([]);
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
      setCurrentPhase(0);
      setActiveRange({ left: -1, right: -1 });
      setHighlightIndices([]);
      setSortedRuns([]);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'phase') {
      setCurrentPhase(step.phase);
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'selectInRun') {
      setActiveRange({ left: step.left, right: step.right });
      setHighlightIndices([step.index]);
      setHighlightType('select');
    } else if (step.action === 'insertInRun') {
      setHighlightIndices([step.index]);
      setHighlightType('insert');
      setArray(step.array);
    } else if (step.action === 'runSorted') {
      setSortedRuns(prev => [...prev, { left: step.left, right: step.right }]);
      setHighlightIndices([]);
      setActiveRange({ left: -1, right: -1 });
    } else if (step.action === 'mergeRuns') {
      setActiveRange({ left: step.left, right: step.right });
      setHighlightIndices([]);
      setHighlightType('merge');
    } else if (step.action === 'placeMerge') {
      setHighlightIndices([step.index]);
      setHighlightType('place');
      setArray(step.array);
    } else if (step.action === 'mergeComplete') {
      setHighlightIndices([]);
      setActiveRange({ left: -1, right: -1 });
    } else if (step.action === 'complete') {
      setHighlightIndices([]);
      setHighlightType('');
      setActiveRange({ left: -1, right: -1 });
      setCurrentPhase(0);
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
    setCurrentPhase(0);
    setActiveRange({ left: -1, right: -1 });
    setHighlightIndices([]);
    setHighlightType('');
    setSortedRuns([]);
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const isInSortedRun = (index) => {
    return sortedRuns.some(run => index >= run.left && index <= run.right);
  };

  const getBarColor = (index) => {
    if (currentStep >= steps.length - 1) return '#4ade80';
    if (highlightIndices.includes(index)) {
      if (highlightType === 'select') return '#fbbf24';
      if (highlightType === 'insert') return '#8b5cf6';
      if (highlightType === 'place') return '#3b82f6';
    }
    if (index >= activeRange.left && index <= activeRange.right && activeRange.left !== -1) {
      return '#f97316';
    }
    if (isInSortedRun(index)) return '#4ade80';
    return '#94a3b8';
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="timsort-container">
      <div className="algorithm-info">
        <h2>Timsort</h2>
        <p>
          Timsort is a hybrid sorting algorithm derived from Merge Sort and Insertion Sort. It divides the array into small runs,
          sorts them with Insertion Sort, then merges them with Merge Sort. Used in Python and Java. Time complexity: O(n log n).
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 5, 21, 7, 23"
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

      {currentPhase > 0 && (
        <div className="phase-info">
          <span>
            {currentPhase === 1 ? 'Phase 1: Insertion Sort on Runs' : 'Phase 2: Merging Runs'}
          </span>
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
          <span>Active Run</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Selecting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Inserting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Merging</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Sorted Run</span>
        </div>
      </div>
    </div>
  );
}

export default Timsort;
