import React, { useState, useEffect, useRef } from 'react';
import './InsertionSort.css';
import AnimationControls from './AnimationControls';

// Generate insertion sort steps
function generateInsertionSortSteps(array) {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({ action: 'init', array: [...arr], message: 'Starting Insertion Sort' });

  steps.push({
    action: 'sorted',
    index: 0,
    array: [...arr],
    message: 'First element is considered sorted'
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    
    steps.push({
      action: 'select',
      index: i,
      key: key,
      array: [...arr],
      message: `Selecting ${key} to insert into sorted portion`
    });

    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      steps.push({
        action: 'compare',
        indices: [j, i],
        array: [...arr],
        message: `${arr[j]} > ${key}, shifting ${arr[j]} right`
      });

      arr[j + 1] = arr[j];
      
      steps.push({
        action: 'shift',
        index: j + 1,
        array: [...arr],
        message: `Shifted ${arr[j + 1]} to position ${j + 1}`
      });

      j--;
    }

    arr[j + 1] = key;
    
    steps.push({
      action: 'insert',
      index: j + 1,
      key: key,
      array: [...arr],
      message: `Inserted ${key} at position ${j + 1}`
    });

    steps.push({
      action: 'sorted',
      index: i,
      array: [...arr],
      message: `First ${i + 1} elements are now sorted`
    });
  }

  steps.push({ action: 'complete', array: [...arr], message: 'Insertion Sort Complete!' });

  return steps;
}

function InsertionSort() {
  const [inputValue, setInputValue] = useState('12, 11, 13, 5, 6');
  const [array, setArray] = useState([12, 11, 13, 5, 6]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [sortedIndex, setSortedIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [message, setMessage] = useState('Click "Generate Steps" to start');
  
  const animationRef = useRef(null);

  const handleGenerateSteps = () => {
    const newSteps = generateInsertionSortSteps(array);
    setSteps(newSteps);
    setCurrentStep(0);
    setSortedIndex(0);
    setSelectedIndex(-1);
    setHighlightIndices([]);
    setHighlightType('');
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
      setSortedIndex(0);
      setSelectedIndex(-1);
      setHighlightIndices([]);
      setMessage('Array updated. Click "Generate Steps" to visualize.');
    }
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.action === 'select') {
      setSelectedIndex(step.index);
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'compare') {
      setHighlightIndices(step.indices);
      setHighlightType('compare');
    } else if (step.action === 'shift') {
      setHighlightIndices([step.index]);
      setHighlightType('shift');
      setArray(step.array);
    } else if (step.action === 'insert') {
      setHighlightIndices([step.index]);
      setHighlightType('insert');
      setArray(step.array);
    } else if (step.action === 'sorted') {
      setSortedIndex(step.index);
      setSelectedIndex(-1);
      setHighlightIndices([]);
      setHighlightType('');
    } else if (step.action === 'complete') {
      setSortedIndex(array.length - 1);
      setSelectedIndex(-1);
      setHighlightIndices([]);
      setHighlightType('');
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
    setSortedIndex(0);
    setSelectedIndex(-1);
    setHighlightIndices([]);
    setHighlightType('');
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getBarColor = (index) => {
    if (index <= sortedIndex && sortedIndex >= 0) {
      if (index === selectedIndex) return '#8b5cf6'; // purple - selected
      if (highlightIndices.includes(index)) {
        if (highlightType === 'compare') return '#fbbf24'; // yellow
        if (highlightType === 'shift') return '#ef4444'; // red
        if (highlightType === 'insert') return '#3b82f6'; // blue
      }
      return '#4ade80'; // green - sorted portion
    }
    if (index === selectedIndex) return '#8b5cf6'; // purple - selected
    return '#94a3b8'; // gray - unsorted
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="insertion-sort-container">
      <div className="algorithm-info">
        <h2>Insertion Sort</h2>
        <p>
          Insertion Sort builds the final sorted array one item at a time. It picks an element and inserts it into its correct position in the sorted portion.
          Similar to sorting playing cards in your hands.
        </p>
      </div>

      <div className="input-section">
        <label>
          Enter numbers (comma-separated):
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 12, 11, 13, 5"
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
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Sorted Portion</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Selected Key</span>
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
      </div>
    </div>
  );
}

export default InsertionSort;
