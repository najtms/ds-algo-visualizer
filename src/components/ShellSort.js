import React, { useState, useEffect, useRef } from 'react';
import './ShellSort.css';
import AnimationControls from './AnimationControls';

// Generate shell sort steps
function generateShellSortSteps(array) {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({ action: 'init', array: [...arr], message: 'Starting Shell Sort' });

  // Start with a large gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      action: 'newGap',
      gap: gap,
      array: [...arr],
      message: `Starting with gap = ${gap}`
    });

    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      
      steps.push({
        action: 'select',
        index: i,
        gap: gap,
        array: [...arr],
        message: `Selecting element at index ${i} (value: ${temp})`
      });

      let j = i;
      
      while (j >= gap && arr[j - gap] > temp) {
        steps.push({
          action: 'compare',
          indices: [j, j - gap],
          gap: gap,
          array: [...arr],
          message: `Comparing ${temp} with ${arr[j - gap]} (gap: ${gap})`
        });

        arr[j] = arr[j - gap];
        
        steps.push({
          action: 'shift',
          index: j,
          gap: gap,
          array: [...arr],
          message: `Shifted ${arr[j]} from position ${j - gap} to ${j}`
        });

        j -= gap;
      }

      arr[j] = temp;
      
      steps.push({
        action: 'insert',
        index: j,
        value: temp,
        gap: gap,
        array: [...arr],
        message: `Inserted ${temp} at position ${j}`
      });
    }

    steps.push({
      action: 'gapComplete',
      gap: gap,
      array: [...arr],
      message: `Completed pass with gap = ${gap}`
    });
  }

  steps.push({ action: 'complete', array: [...arr], message: 'Shell Sort Complete!' });

  return steps;
}

function ShellSort() {
  const [inputValue, setInputValue] = useState('23, 29, 15, 19, 31, 7, 9, 5, 2');
  const [array, setArray] = useState([23, 29, 15, 19, 31, 7, 9, 5, 2]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentGap, setCurrentGap] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [gapPairs, setGapPairs] = useState([]);
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateShellSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setCurrentGap(0);
    setSelectedIndex(-1);
    setHighlightIndices([]);
    setHighlightType('');
    setGapPairs([]);
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
      setCurrentGap(0);
      setSelectedIndex(-1);
      setHighlightIndices([]);
      setGapPairs([]);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'newGap') {
      setCurrentGap(step.gap);
      setHighlightIndices([]);
      setHighlightType('');
      setGapPairs([]);
    } else if (step.action === 'select') {
      setSelectedIndex(step.index);
      setCurrentGap(step.gap);
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'compare') {
      setHighlightIndices(step.indices);
      setHighlightType('compare');
      setCurrentGap(step.gap);
      // Show gap pairs
      const pairs = [];
      for (let i = 0; i < array.length; i += step.gap) {
        pairs.push(i);
      }
      setGapPairs(pairs);
    } else if (step.action === 'shift') {
      setHighlightIndices([step.index]);
      setHighlightType('shift');
      setArray(step.array);
      setCurrentGap(step.gap);
    } else if (step.action === 'insert') {
      setHighlightIndices([step.index]);
      setHighlightType('insert');
      setArray(step.array);
      setCurrentGap(step.gap);
    } else if (step.action === 'gapComplete') {
      setSelectedIndex(-1);
      setHighlightIndices([]);
      setHighlightType('');
      setGapPairs([]);
    } else if (step.action === 'complete') {
      setCurrentGap(0);
      setSelectedIndex(-1);
      setHighlightIndices([]);
      setHighlightType('');
      setGapPairs([]);
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
    setCurrentGap(0);
    setSelectedIndex(-1);
    setHighlightIndices([]);
    setHighlightType('');
    setGapPairs([]);
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getBarColor = (index) => {
    if (currentStep >= steps.length - 1) return '#4ade80'; // all sorted
    if (index === selectedIndex) return '#8b5cf6'; // purple - selected
    if (highlightIndices.includes(index)) {
      if (highlightType === 'compare') return '#fbbf24'; // yellow
      if (highlightType === 'shift') return '#ef4444'; // red
      if (highlightType === 'insert') return '#3b82f6'; // blue
    }
    if (gapPairs.includes(index) && currentGap > 0) return '#06b6d4'; // cyan - gap group
    return '#94a3b8'; // gray
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="shell-sort-container">
      <div className="algorithm-info">
        <h2>Shell Sort</h2>
        <p>
          Shell Sort is an optimization of Insertion Sort. It starts by sorting elements far apart from each other and progressively reduces the gap.
          This allows elements to move long distances quickly. The gap sequence used here is n/2, n/4, ..., 1.
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 23, 29, 15, 19"
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

      <div className="gap-info">
        {currentGap > 0 && <span>Current Gap: <strong>{currentGap}</strong></span>}
      </div>

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
          <div className="legend-color" style={{ backgroundColor: '#06b6d4' }}></div>
          <span>Gap Group</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Shifting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Inserting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}

export default ShellSort;
