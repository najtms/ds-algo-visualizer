import React, { useState, useEffect, useRef } from 'react';
import './QuickSort.css';
import AnimationControls from './AnimationControls';

// Generate quicksort steps using Sedgewick's 2-way partitioning
function generateQuickSortSteps(array) {
  const steps = [];
  const arr = [...array];
  
  steps.push({ action: 'init', array: [...arr], message: 'Starting QuickSort (Sedgewick 2-way Partition)' });

  function quickSort(arr, low, high) {
    if (low >= high) return;

    steps.push({
      action: 'newPartition',
      low: low,
      high: high,
      array: [...arr],
      message: `Partitioning range [${low}...${high}]`
    });

    const pivotIndex = partition(arr, low, high);
    
    steps.push({
      action: 'pivotPlaced',
      index: pivotIndex,
      array: [...arr],
      message: `Pivot ${arr[pivotIndex]} placed at position ${pivotIndex}`
    });

    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }

  function partition(arr, low, high) {
    const pivot = arr[low];
    
    steps.push({
      action: 'selectPivot',
      index: low,
      value: pivot,
      array: [...arr],
      message: `Selected pivot: ${pivot} at index ${low}`
    });

    let i = low + 1;
    let j = high;

    while (true) {
      // Find element on left to swap
      while (i <= high && arr[i] < pivot) {
        steps.push({
          action: 'scanLeft',
          index: i,
          pivot: pivot,
          array: [...arr],
          message: `${arr[i]} < ${pivot}, moving left pointer`
        });
        i++;
      }

      // Find element on right to swap
      while (j > low && arr[j] > pivot) {
        steps.push({
          action: 'scanRight',
          index: j,
          pivot: pivot,
          array: [...arr],
          message: `${arr[j]} > ${pivot}, moving right pointer`
        });
        j--;
      }

      // Check if pointers cross
      if (i >= j) break;

      steps.push({
        action: 'swap',
        indices: [i, j],
        array: [...arr],
        message: `Swapping ${arr[i]} and ${arr[j]}`
      });

      [arr[i], arr[j]] = [arr[j], arr[i]];
      
      steps.push({
        action: 'swapped',
        indices: [i, j],
        array: [...arr],
        message: `Swapped positions ${i} and ${j}`
      });

      i++;
      j--;
    }

    steps.push({
      action: 'finalSwap',
      indices: [low, j],
      array: [...arr],
      message: `Placing pivot ${pivot} at final position ${j}`
    });

    [arr[low], arr[j]] = [arr[j], arr[low]];
    
    steps.push({
      action: 'pivotInPlace',
      index: j,
      array: [...arr],
      message: `Pivot ${arr[j]} is now in correct position`
    });

    return j;
  }

  quickSort(arr, 0, arr.length - 1);

  steps.push({ action: 'complete', array: [...arr], message: 'QuickSort Complete!' });

  return steps;
}

function QuickSort() {
  const [inputValue, setInputValue] = useState('33, 10, 55, 71, 29, 19, 80, 41');
  const [array, setArray] = useState([33, 10, 55, 71, 29, 19, 80, 41]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [activeRange, setActiveRange] = useState({ low: -1, high: -1 });
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [pointers, setPointers] = useState({ left: -1, right: -1 });
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateQuickSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setActiveRange({ low: -1, high: -1 });
    setPivotIndex(-1);
    setPointers({ left: -1, right: -1 });
    setHighlightIndices([]);
    setHighlightType('');
    setSortedIndices(new Set());
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
      setActiveRange({ low: -1, high: -1 });
      setPivotIndex(-1);
      setPointers({ left: -1, right: -1 });
      setHighlightIndices([]);
      setSortedIndices(new Set());
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'newPartition') {
      setActiveRange({ low: step.low, high: step.high });
      setPivotIndex(-1);
      setPointers({ left: -1, right: -1 });
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'selectPivot') {
      setPivotIndex(step.index);
      setHighlightIndices([step.index]);
      setHighlightType('pivot');
    } else if (step.action === 'scanLeft') {
      setPointers(prev => ({ ...prev, left: step.index }));
      setHighlightIndices([step.index]);
      setHighlightType('scanLeft');
    } else if (step.action === 'scanRight') {
      setPointers(prev => ({ ...prev, right: step.index }));
      setHighlightIndices([step.index]);
      setHighlightType('scanRight');
    } else if (step.action === 'swap' || step.action === 'finalSwap') {
      setHighlightIndices(step.indices);
      setHighlightType('swap');
    } else if (step.action === 'swapped') {
      setArray(step.array);
      setHighlightIndices([]);
    } else if (step.action === 'pivotInPlace') {
      setArray(step.array);
      setSortedIndices(prev => new Set([...prev, step.index]));
      setPivotIndex(-1);
      setPointers({ left: -1, right: -1 });
    } else if (step.action === 'pivotPlaced') {
      setSortedIndices(prev => new Set([...prev, step.index]));
    } else if (step.action === 'complete') {
      setActiveRange({ low: -1, high: -1 });
      setPivotIndex(-1);
      setPointers({ left: -1, right: -1 });
      setHighlightIndices([]);
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
    setActiveRange({ low: -1, high: -1 });
    setPivotIndex(-1);
    setPointers({ left: -1, right: -1 });
    setHighlightIndices([]);
    setHighlightType('');
    setSortedIndices(new Set());
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getBarColor = (index) => {
    if (sortedIndices.has(index)) return '#4ade80'; // green - sorted
    if (index === pivotIndex) return '#ef4444'; // red - pivot
    if (highlightIndices.includes(index)) {
      if (highlightType === 'swap') return '#fbbf24'; // yellow
      if (highlightType === 'scanLeft') return '#3b82f6'; // blue
      if (highlightType === 'scanRight') return '#8b5cf6'; // purple
    }
    if (index >= activeRange.low && index <= activeRange.high && activeRange.low !== -1) {
      return '#f97316'; // orange - active partition
    }
    return '#94a3b8'; // gray
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="quick-sort-container">
      <div className="algorithm-info">
        <h2>QuickSort (Sedgewick 2-way Partition)</h2>
        <p>
          QuickSort uses divide-and-conquer by selecting a pivot and partitioning the array around it.
          Sedgewick's 2-way partitioning scans from both ends, swapping elements that are out of place.
          Average time complexity: O(n log n).
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 33, 10, 55, 71"
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
          <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
          <span>Active Partition</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Pivot</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Left Scan</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Right Scan</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
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

export default QuickSort;
