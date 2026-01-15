import React, { useState, useEffect, useRef } from 'react';
import './MaxHeap.css';
import AnimationControls from './AnimationControls';

function MaxHeap() {
  const [heap, setHeap] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [message, setMessage] = useState('Enter values to build the Max Heap');
  
  const animationRef = useRef(null);

  const parent = (i) => Math.floor((i - 1) / 2);
  const leftChild = (i) => 2 * i + 1;
  const rightChild = (i) => 2 * i + 2;

  const heapifyUp = (arr, index, steps) => {
    let current = index;
    
    while (current > 0) {
      const parentIdx = parent(current);
      
      steps.push({
        action: 'compare',
        indices: [current, parentIdx],
        array: [...arr],
        message: `Comparing ${arr[current]} with parent ${arr[parentIdx]}`
      });
      
      if (arr[current] > arr[parentIdx]) {
        steps.push({
          action: 'swap',
          indices: [current, parentIdx],
          array: [...arr],
          message: `Swapping ${arr[current]} and ${arr[parentIdx]}`
        });
        
        [arr[current], arr[parentIdx]] = [arr[parentIdx], arr[current]];
        current = parentIdx;
        
        steps.push({
          action: 'swapped',
          indices: [current],
          array: [...arr],
          message: `Element bubbled up to index ${current}`
        });
      } else {
        steps.push({
          action: 'heapified',
          index: current,
          array: [...arr],
          message: `Heap property satisfied at index ${current}`
        });
        break;
      }
    }
  };

  const heapifyDown = (arr, index, heapSize, steps) => {
    let current = index;
    
    while (true) {
      const left = leftChild(current);
      const right = rightChild(current);
      let largest = current;
      
      if (left < heapSize) {
        steps.push({
          action: 'compare',
          indices: [current, left],
          array: [...arr],
          message: `Comparing ${arr[current]} with left child ${arr[left]}`
        });
        
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }
      
      if (right < heapSize) {
        steps.push({
          action: 'compare',
          indices: [largest, right],
          array: [...arr],
          message: `Comparing ${arr[largest]} with right child ${arr[right]}`
        });
        
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }
      
      if (largest !== current) {
        steps.push({
          action: 'swap',
          indices: [current, largest],
          array: [...arr],
          message: `Swapping ${arr[current]} with ${arr[largest]}`
        });
        
        [arr[current], arr[largest]] = [arr[largest], arr[current]];
        current = largest;
        
        steps.push({
          action: 'swapped',
          indices: [current],
          array: [...arr],
          message: `Element moved down to index ${current}`
        });
      } else {
        steps.push({
          action: 'heapified',
          index: current,
          array: [...arr],
          message: `Heap property satisfied`
        });
        break;
      }
    }
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    const newSteps = [];
    const newHeap = [...heap, value];
    
    newSteps.push({
      action: 'insert',
      value: value,
      array: [...newHeap],
      message: `Inserting ${value} at the end`
    });
    
    heapifyUp(newHeap, newHeap.length - 1, newSteps);
    
    newSteps.push({
      action: 'complete',
      array: [...newHeap],
      message: 'Insertion complete'
    });
    
    setHeap(newHeap);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    setMessage(newSteps[0].message);
    setInputValue('');
  };

  const handleDelete = () => {
    if (heap.length === 0) {
      setMessage('Heap is empty');
      return;
    }
    
    const newSteps = [];
    const newHeap = [...heap];
    const maxValue = newHeap[0];
    
    newSteps.push({
      action: 'extractMax',
      value: maxValue,
      array: [...newHeap],
      message: `Extracting maximum: ${maxValue}`
    });
    
    // Replace root with last element
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();
    
    if (newHeap.length > 0) {
      newSteps.push({
        action: 'replaceRoot',
        array: [...newHeap],
        message: `Replaced root with last element: ${newHeap[0]}`
      });
      
      heapifyDown(newHeap, 0, newHeap.length, newSteps);
    }
    
    newSteps.push({
      action: 'complete',
      array: [...newHeap],
      message: `Deleted maximum ${maxValue}`
    });
    
    setHeap(newHeap);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setMessage(newSteps[0].message);
  };

  const handleClear = () => {
    setHeap([]);
    setSteps([]);
    setCurrentStep(0);
    setHighlightIndices([]);
    setMessage('Heap cleared');
  };

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
    } else if (step.action === 'swapped') {
      setHeap(step.array);
      setHighlightIndices(step.indices);
      setHighlightType('swapped');
    } else if (step.action === 'insert') {
      setHeap(step.array);
      setHighlightIndices([step.array.length - 1]);
      setHighlightType('insert');
    } else if (step.action === 'extractMax') {
      setHighlightIndices([0]);
      setHighlightType('extract');
    } else if (step.action === 'replaceRoot') {
      setHeap(step.array);
      setHighlightIndices([0]);
      setHighlightType('replace');
    } else if (step.action === 'complete' || step.action === 'heapified') {
      setHeap(step.array);
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
    if (steps.length === 0) return;
    if (currentStep < steps.length - 1) {
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
    setHighlightIndices([]);
    setHighlightType('');
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getNodeColor = (index) => {
    if (highlightIndices.includes(index)) {
      if (highlightType === 'compare') return '#fbbf24';
      if (highlightType === 'swap') return '#3b82f6';
      if (highlightType === 'swapped') return '#8b5cf6';
      if (highlightType === 'insert') return '#4ade80';
      if (highlightType === 'extract') return '#ef4444';
      if (highlightType === 'replace') return '#f97316';
    }
    return '#10b981';
  };

  // Calculate positions for heap visualization
  const calculateHeapPosition = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    
    const canvasWidth = 800;
    const startY = 50;
    const levelHeight = 80;
    
    const spacing = canvasWidth / (nodesInLevel + 1);
    const x = spacing * (positionInLevel + 1);
    const y = startY + level * levelHeight;
    
    return { x, y, level };
  };

  return (
    <div className="max-heap-container">
      <div className="algorithm-info">
        <h2>Max Heap</h2>
        <p>
          A Max Heap is a complete binary tree where each parent node is greater than or equal to its children.
          The maximum element is always at the root. Supports efficient insertion and extraction of maximum element.
        </p>
      </div>

      <div className="controls-section">
        <div className="input-group">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
          />
          <button onClick={handleInsert} className="btn-primary">
            Insert
          </button>
          <button onClick={handleDelete} className="btn-secondary">
            Delete Max
          </button>
          <button onClick={handleClear} className="btn-danger">
            Clear Heap
          </button>
        </div>
      </div>

      {steps.length > 0 && (
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
      )}

      <div className="message-box">
        {message}
      </div>

      <div className="heap-array">
        <strong>Array representation:</strong>
        <div className="array-display">
          {heap.map((value, index) => (
            <div
              key={index}
              className={`array-cell ${highlightIndices.includes(index) ? 'highlight' : ''}`}
              style={{ backgroundColor: getNodeColor(index) }}
            >
              {value}
            </div>
          ))}
          {heap.length === 0 && <span className="empty-msg">Empty</span>}
        </div>
      </div>

      <div className="tree-visualization">
        <svg width="800" height="400">
          {/* Draw edges */}
          {heap.map((_, index) => {
            const left = leftChild(index);
            const right = rightChild(index);
            const pos = calculateHeapPosition(index);
            
            return (
              <g key={`edges-${index}`}>
                {left < heap.length && (
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={calculateHeapPosition(left).x}
                    y2={calculateHeapPosition(left).y}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                )}
                {right < heap.length && (
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={calculateHeapPosition(right).x}
                    y2={calculateHeapPosition(right).y}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
          
          {/* Draw nodes */}
          {heap.map((value, index) => {
            const pos = calculateHeapPosition(index);
            return (
              <g key={`node-${index}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="25"
                  fill={getNodeColor(index)}
                  stroke="#1f2937"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
        
        {heap.length === 0 && (
          <div className="empty-tree-message">
            Heap is empty. Insert values to build the Max Heap.
          </div>
        )}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
          <span>Normal Node</span>
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
          <span>Inserting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Extracting Max</span>
        </div>
      </div>
    </div>
  );
}

export default MaxHeap;
