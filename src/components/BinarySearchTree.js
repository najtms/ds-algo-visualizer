import React, { useState, useEffect, useRef } from 'react';
import './BinarySearchTree.css';
import AnimationControls from './AnimationControls';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Calculate tree positions for visualization
function calculatePositions(node, x = 400, y = 50, level = 0, offset = 200) {
  if (!node) return [];
  
  const positions = [{ node, x, y, level }];
  const newOffset = offset / 2;
  
  if (node.left) {
    positions.push(...calculatePositions(node.left, x - offset, y + 80, level + 1, newOffset));
  }
  if (node.right) {
    positions.push(...calculatePositions(node.right, x + offset, y + 80, level + 1, newOffset));
  }
  
  return positions;
}

function BinarySearchTree() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState('insert');
  const [traversalType, setTraversalType] = useState('inorder');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [highlightType, setHighlightType] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [message, setMessage] = useState('Enter values to build the tree');
  
  const animationRef = useRef(null);

  // Insert node
  const insertNode = (root, value) => {
    const steps = [];
    
    const insert = (node, val, path = []) => {
      if (!node) {
        steps.push({
          action: 'insert',
          value: val,
          path: [...path],
          message: `Inserted ${val}`
        });
        return new TreeNode(val);
      }
      
      steps.push({
        action: 'compare',
        current: node.value,
        value: val,
        path: [...path, node.value],
        message: `Comparing ${val} with ${node.value}`
      });
      
      if (val < node.value) {
        steps.push({
          action: 'goLeft',
          current: node.value,
          value: val,
          path: [...path, node.value],
          message: `${val} < ${node.value}, go left`
        });
        node.left = insert(node.left, val, [...path, node.value]);
      } else if (val > node.value) {
        steps.push({
          action: 'goRight',
          current: node.value,
          value: val,
          path: [...path, node.value],
          message: `${val} > ${node.value}, go right`
        });
        node.right = insert(node.right, val, [...path, node.value]);
      } else {
        steps.push({
          action: 'duplicate',
          value: val,
          message: `Value ${val} already exists`
        });
      }
      
      return node;
    };
    
    const newRoot = insert(root, value);
    return { newRoot, steps };
  };

  // Delete node
  const deleteNode = (root, value) => {
    const steps = [];
    
    const findMin = (node) => {
      while (node.left) node = node.left;
      return node;
    };
    
    const deleteRec = (node, val, path = []) => {
      if (!node) {
        steps.push({
          action: 'notFound',
          value: val,
          message: `Value ${val} not found`
        });
        return null;
      }
      
      steps.push({
        action: 'search',
        current: node.value,
        value: val,
        path: [...path, node.value],
        message: `Searching for ${val}, current: ${node.value}`
      });
      
      if (val < node.value) {
        node.left = deleteRec(node.left, val, [...path, node.value]);
      } else if (val > node.value) {
        node.right = deleteRec(node.right, val, [...path, node.value]);
      } else {
        // Node found
        steps.push({
          action: 'found',
          value: val,
          path: [...path, node.value],
          message: `Found ${val}, deleting...`
        });
        
        // Case 1: Leaf node
        if (!node.left && !node.right) {
          steps.push({
            action: 'deleteLeaf',
            value: val,
            message: `${val} is a leaf, removing`
          });
          return null;
        }
        
        // Case 2: One child
        if (!node.left) {
          steps.push({
            action: 'deleteOneChild',
            value: val,
            message: `${val} has one child (right), replacing`
          });
          return node.right;
        }
        if (!node.right) {
          steps.push({
            action: 'deleteOneChild',
            value: val,
            message: `${val} has one child (left), replacing`
          });
          return node.left;
        }
        
        // Case 3: Two children
        const successor = findMin(node.right);
        steps.push({
          action: 'findSuccessor',
          value: val,
          successor: successor.value,
          message: `${val} has two children, replacing with successor ${successor.value}`
        });
        
        node.value = successor.value;
        node.right = deleteRec(node.right, successor.value, [...path, node.value]);
      }
      
      return node;
    };
    
    const newRoot = deleteRec(root, value);
    return { newRoot, steps };
  };

  // Traversals
  const traverseTree = (root, type) => {
    const steps = [];
    const result = [];
    
    const inorder = (node) => {
      if (!node) return;
      inorder(node.left);
      steps.push({
        action: 'visit',
        value: node.value,
        message: `Visit ${node.value}`
      });
      result.push(node.value);
      inorder(node.right);
    };
    
    const preorder = (node) => {
      if (!node) return;
      steps.push({
        action: 'visit',
        value: node.value,
        message: `Visit ${node.value}`
      });
      result.push(node.value);
      preorder(node.left);
      preorder(node.right);
    };
    
    const postorder = (node) => {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      steps.push({
        action: 'visit',
        value: node.value,
        message: `Visit ${node.value}`
      });
      result.push(node.value);
    };
    
    if (type === 'inorder') inorder(root);
    else if (type === 'preorder') preorder(root);
    else if (type === 'postorder') postorder(root);
    
    steps.push({
      action: 'complete',
      result: [...result],
      message: `${type} traversal complete: ${result.join(' → ')}`
    });
    
    return { steps, result };
  };

  const handleOperation = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    if (operation === 'insert') {
      const { newRoot, steps: newSteps } = insertNode(root, value);
      setRoot(newRoot);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(true);
      setMessage(newSteps[0]?.message || 'Insertion started');
    } else if (operation === 'delete') {
      if (!root) {
        setMessage('Tree is empty');
        return;
      }
      const { newRoot, steps: newSteps } = deleteNode(root, value);
      setRoot(newRoot);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(true);
      setMessage(newSteps[0]?.message || 'Deletion started');
    }
    
    setInputValue('');
  };

  const handleTraversal = () => {
    if (!root) {
      setMessage('Tree is empty');
      return;
    }
    
    const { steps: newSteps, result } = traverseTree(root, traversalType);
    setSteps(newSteps);
    setCurrentStep(0);
    setTraversalResult(result);
    setIsPlaying(true);
    setMessage(`${traversalType} traversal started`);
  };

  const handleClear = () => {
    setRoot(null);
    setSteps([]);
    setCurrentStep(0);
    setHighlightedNodes([]);
    setTraversalResult([]);
    setMessage('Tree cleared');
  };

  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;
    
    const step = steps[currentStep];
    setMessage(step.message || '');
    
    if (step.action === 'compare' || step.action === 'search') {
      setHighlightedNodes([step.current]);
      setHighlightType('compare');
    } else if (step.action === 'insert') {
      setHighlightedNodes([step.value]);
      setHighlightType('insert');
    } else if (step.action === 'found' || step.action === 'deleteLeaf' || step.action === 'deleteOneChild') {
      setHighlightedNodes([step.value]);
      setHighlightType('delete');
    } else if (step.action === 'visit') {
      setHighlightedNodes([step.value]);
      setHighlightType('visit');
    } else if (step.action === 'complete') {
      setHighlightedNodes([]);
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
    setHighlightedNodes([]);
    setHighlightType('');
    if (steps.length > 0) {
      setMessage(steps[0].message);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const positions = calculatePositions(root);

  const getNodeColor = (value) => {
    if (highlightedNodes.includes(value)) {
      if (highlightType === 'compare') return '#fbbf24';
      if (highlightType === 'insert') return '#4ade80';
      if (highlightType === 'delete') return '#ef4444';
      if (highlightType === 'visit') return '#3b82f6';
    }
    return '#8b5cf6';
  };

  return (
    <div className="bst-container">
      <div className="algorithm-info">
        <h2>Binary Search Tree (BST)</h2>
        <p>
          A Binary Search Tree is a tree data structure where each node has at most two children.
          For each node: left child &lt; node &lt; right child. Supports efficient insertion, deletion, and search operations.
        </p>
      </div>

      <div className="controls-section">
        <div className="input-group">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            onKeyPress={(e) => e.key === 'Enter' && handleOperation()}
          />
          <select value={operation} onChange={(e) => setOperation(e.target.value)}>
            <option value="insert">Insert</option>
            <option value="delete">Delete</option>
          </select>
          <button onClick={handleOperation} className="btn-primary">
            Execute
          </button>
        </div>

        <div className="traversal-group">
          <select value={traversalType} onChange={(e) => setTraversalType(e.target.value)}>
            <option value="inorder">InOrder</option>
            <option value="preorder">PreOrder</option>
            <option value="postorder">PostOrder</option>
          </select>
          <button onClick={handleTraversal} className="btn-secondary">
            Traverse
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

      {traversalResult.length > 0 && (
        <div className="traversal-result">
          <strong>Result:</strong> {traversalResult.join(' → ')}
        </div>
      )}

      <div className="tree-visualization">
        <svg width="800" height="500">
          {/* Draw edges first */}
          {positions.map((pos, idx) => (
            <g key={`edges-${idx}`}>
              {pos.node.left && (
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={pos.x - (200 / Math.pow(2, pos.level))}
                  y2={pos.y + 80}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
              )}
              {pos.node.right && (
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={pos.x + (200 / Math.pow(2, pos.level))}
                  y2={pos.y + 80}
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
              )}
            </g>
          ))}
          
          {/* Draw nodes */}
          {positions.map((pos, idx) => (
            <g key={`node-${idx}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="25"
                fill={getNodeColor(pos.node.value)}
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
                {pos.node.value}
              </text>
            </g>
          ))}
        </svg>
        
        {!root && (
          <div className="empty-tree-message">
            Tree is empty. Insert values to build the tree.
          </div>
        )}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Normal Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
          <span>Inserting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Deleting</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Visiting (Traversal)</span>
        </div>
      </div>
    </div>
  );
}

export default BinarySearchTree;
