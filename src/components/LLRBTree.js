import React, { useState, useEffect, useRef } from 'react';
import './LLRBTree.css';
import AnimationControls from './AnimationControls';

const RED = true;
const BLACK = false;

class Node {
  constructor(value, color = RED) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.color = color;
  }
}

function LLRBTree() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [message, setMessage] = useState('Enter values to build the Left-Leaning Red-Black Tree');
  const [highlightNodes, setHighlightNodes] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [statistics, setStatistics] = useState({
    colorFlips: 0,
    leftRotations: 0,
    rightRotations: 0
  });
  
  const animationRef = useRef(null);

  const isRed = (node) => {
    if (node === null) return false;
    return node.color === RED;
  };

  const rotateLeft = (h, steps, stats) => {
    steps.push({
      action: 'rotateLeft',
      node: h.value,
      message: `Left rotation at node ${h.value}`,
      tree: cloneTree(h)
    });
    
    stats.leftRotations++;
    
    const x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = RED;
    
    steps.push({
      action: 'rotateLeftComplete',
      node: x.value,
      message: `Left rotation complete, ${x.value} is now parent`,
      tree: cloneTree(x)
    });
    
    return x;
  };

  const rotateRight = (h, steps, stats) => {
    steps.push({
      action: 'rotateRight',
      node: h.value,
      message: `Right rotation at node ${h.value}`,
      tree: cloneTree(h)
    });
    
    stats.rightRotations++;
    
    const x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = RED;
    
    steps.push({
      action: 'rotateRightComplete',
      node: x.value,
      message: `Right rotation complete, ${x.value} is now parent`,
      tree: cloneTree(x)
    });
    
    return x;
  };

  const flipColors = (h, steps, stats) => {
    steps.push({
      action: 'flipColors',
      node: h.value,
      message: `Color flip at node ${h.value}`,
      tree: cloneTree(h)
    });
    
    stats.colorFlips++;
    
    h.color = !h.color;
    h.left.color = !h.left.color;
    h.right.color = !h.right.color;
    
    steps.push({
      action: 'flipColorsComplete',
      node: h.value,
      message: `Color flip complete at node ${h.value}`,
      tree: cloneTree(h)
    });
  };

  const cloneTree = (node) => {
    if (node === null) return null;
    const newNode = new Node(node.value, node.color);
    newNode.left = cloneTree(node.left);
    newNode.right = cloneTree(node.right);
    return newNode;
  };

  const insertRecursive = (h, value, steps, stats) => {
    if (h === null) {
      steps.push({
        action: 'insert',
        value: value,
        message: `Inserting ${value} as a new red node`,
        tree: cloneTree(new Node(value, RED))
      });
      return new Node(value, RED);
    }

    steps.push({
      action: 'compare',
      node: h.value,
      compareValue: value,
      message: `Comparing ${value} with ${h.value}`,
      tree: cloneTree(h)
    });

    if (value < h.value) {
      steps.push({
        action: 'goLeft',
        node: h.value,
        message: `${value} < ${h.value}, going left`,
        tree: cloneTree(h)
      });
      h.left = insertRecursive(h.left, value, steps, stats);
    } else if (value > h.value) {
      steps.push({
        action: 'goRight',
        node: h.value,
        message: `${value} > ${h.value}, going right`,
        tree: cloneTree(h)
      });
      h.right = insertRecursive(h.right, value, steps, stats);
    } else {
      steps.push({
        action: 'duplicate',
        node: h.value,
        message: `Value ${value} already exists`,
        tree: cloneTree(h)
      });
      return h;
    }

    // Fix right-leaning red link
    if (isRed(h.right) && !isRed(h.left)) {
      steps.push({
        action: 'detectRightLean',
        node: h.value,
        message: `Right-leaning red link detected at ${h.value}, needs left rotation`,
        tree: cloneTree(h)
      });
      h = rotateLeft(h, steps, stats);
    }

    // Fix two consecutive left red links
    if (isRed(h.left) && isRed(h.left.left)) {
      steps.push({
        action: 'detectDoubleRed',
        node: h.value,
        message: `Two consecutive left red links at ${h.value}, needs right rotation`,
        tree: cloneTree(h)
      });
      h = rotateRight(h, steps, stats);
    }

    // Fix two red children
    if (isRed(h.left) && isRed(h.right)) {
      steps.push({
        action: 'detectRedChildren',
        node: h.value,
        message: `Both children are red at ${h.value}, needs color flip`,
        tree: cloneTree(h)
      });
      flipColors(h, steps, stats);
    }

    return h;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newSteps = [];
    const stats = {
      colorFlips: statistics.colorFlips,
      leftRotations: statistics.leftRotations,
      rightRotations: statistics.rightRotations
    };

    newSteps.push({
      action: 'start',
      value: value,
      message: `Starting insertion of ${value}`,
      tree: cloneTree(root),
      stats: { ...stats }
    });

    let newRoot = insertRecursive(root, value, newSteps, stats);
    
    // Root must be black
    if (newRoot && newRoot.color === RED) {
      newSteps.push({
        action: 'rootBlack',
        message: `Setting root to black`,
        tree: cloneTree(newRoot)
      });
      newRoot.color = BLACK;
    }

    newSteps.push({
      action: 'complete',
      message: `Insertion of ${value} complete`,
      tree: cloneTree(newRoot),
      stats: { ...stats }
    });

    setRoot(newRoot);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    setStatistics(stats);
    setMessage(newSteps[0].message);
    setInputValue('');
  };

  const handleClear = () => {
    setRoot(null);
    setSteps([]);
    setCurrentStep(0);
    setHighlightNodes([]);
    setMessage('Tree cleared');
    setStatistics({
      colorFlips: 0,
      leftRotations: 0,
      rightRotations: 0
    });
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    const step = steps[currentStep];
    setMessage(step.message || '');

    if (step.tree) {
      setRoot(step.tree);
    }

    if (step.stats) {
      setStatistics(step.stats);
    }

    if (step.action === 'compare' || step.action === 'goLeft' || step.action === 'goRight') {
      setHighlightNodes([step.node]);
      setHighlightType('compare');
    } else if (step.action === 'insert') {
      setHighlightNodes([step.value]);
      setHighlightType('insert');
    } else if (step.action === 'rotateLeft' || step.action === 'rotateRight') {
      setHighlightNodes([step.node]);
      setHighlightType('rotate');
    } else if (step.action === 'flipColors') {
      setHighlightNodes([step.node]);
      setHighlightType('flip');
    } else if (step.action === 'detectRightLean' || step.action === 'detectDoubleRed' || step.action === 'detectRedChildren') {
      setHighlightNodes([step.node]);
      setHighlightType('detect');
    } else {
      setHighlightNodes([]);
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
    setHighlightNodes([]);
    setHighlightType('');
    if (steps.length > 0) {
      setMessage(steps[0].message);
      if (steps[0].tree) {
        setRoot(steps[0].tree);
      }
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const calculatePositions = (node, x = 400, y = 50, xOffset = 200, level = 0) => {
    if (!node) return [];

    const positions = [{
      value: node.value,
      x,
      y,
      color: node.color,
      level
    }];

    const newOffset = xOffset / 2;
    const yStep = 80;

    if (node.left) {
      positions.push(...calculatePositions(node.left, x - xOffset, y + yStep, newOffset, level + 1));
    }

    if (node.right) {
      positions.push(...calculatePositions(node.right, x + xOffset, y + yStep, newOffset, level + 1));
    }

    return positions;
  };

  const getNodeColor = (value) => {
    const node = findNode(root, value);
    if (!node) return '#64748b';
    
    if (highlightNodes.includes(value)) {
      if (highlightType === 'compare') return '#fbbf24';
      if (highlightType === 'insert') return '#4ade80';
      if (highlightType === 'rotate') return '#3b82f6';
      if (highlightType === 'flip') return '#f97316';
      if (highlightType === 'detect') return '#a78bfa';
    }
    
    return node.color === RED ? '#ef4444' : '#1f2937';
  };

  const findNode = (node, value) => {
    if (!node) return null;
    if (node.value === value) return node;
    const left = findNode(node.left, value);
    if (left) return left;
    return findNode(node.right, value);
  };

  const positions = root ? calculatePositions(root) : [];

  return (
    <div className="llrb-tree-container">
      <div className="algorithm-info">
        <h2>Left-Leaning Red-Black Tree</h2>
        <p>
          A self-balancing binary search tree where red links always lean left. 
          Guarantees O(log n) search, insert, and delete operations through rotations and color flips.
        </p>
      </div>

      <div className="statistics-panel">
        <div className="stat-item">
          <span className="stat-label">Color Flips:</span>
          <span className="stat-value">{statistics.colorFlips}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Left Rotations:</span>
          <span className="stat-value">{statistics.leftRotations}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Right Rotations:</span>
          <span className="stat-value">{statistics.rightRotations}</span>
        </div>
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
          <button onClick={handleClear} className="btn-danger">
            Clear Tree
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

      <div className="tree-visualization">
        <svg width="800" height="500">
          {/* Draw edges */}
          {positions.map((pos) => {
            const node = findNode(root, pos.value);
            if (!node) return null;

            const edges = [];
            
            if (node.left) {
              const leftPos = positions.find(p => p.value === node.left.value);
              if (leftPos) {
                edges.push(
                  <line
                    key={`edge-left-${pos.value}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={leftPos.x}
                    y2={leftPos.y}
                    stroke={node.left.color === RED ? '#ef4444' : '#cbd5e1'}
                    strokeWidth={node.left.color === RED ? '4' : '2'}
                  />
                );
              }
            }

            if (node.right) {
              const rightPos = positions.find(p => p.value === node.right.value);
              if (rightPos) {
                edges.push(
                  <line
                    key={`edge-right-${pos.value}`}
                    x1={pos.x}
                    y1={pos.y}
                    x2={rightPos.x}
                    y2={rightPos.y}
                    stroke={node.right.color === RED ? '#ef4444' : '#cbd5e1'}
                    strokeWidth={node.right.color === RED ? '4' : '2'}
                  />
                );
              }
            }

            return edges;
          })}

          {/* Draw nodes */}
          {positions.map((pos) => (
            <g key={`node-${pos.value}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="25"
                fill={getNodeColor(pos.value)}
                stroke="#fff"
                strokeWidth="3"
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
                {pos.value}
              </text>
            </g>
          ))}
        </svg>

        {!root && (
          <div className="empty-tree-message">
            Tree is empty. Insert values to build the Left-Leaning Red-Black Tree.
          </div>
        )}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#1f2937' }}></div>
          <span>Black Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Red Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Rotating</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
          <span>Color Flip</span>
        </div>
      </div>
    </div>
  );
}

export default LLRBTree;
