import React from 'react';
import './ModernStyles.css';

export function ToolsShowcase({ onToolSelect }) {
  const tools = [
    {
      name: 'Sorting Algorithms',
      icon: '⇅',
      description: 'Visualize bubble sort, quick sort, merge sort, and more',
      color: 'blue-cyan',
    },
    {
      name: 'Binary Search Tree',
      icon: '⎇',
      description: 'Explore tree operations and traversals',
      color: 'purple-pink',
    },
    {
      name: 'Heaps',
      icon: '▲',
      description: 'Understand Max Heap and Min Heap structures',
      color: 'green-emerald',
    },
    {
      name: 'Red-Black Tree',
      icon: '🌳',
      description: 'See self-balancing tree rotations and color flips',
      color: 'orange-red',
    },
  ];

  return (
    <div id="tools-showcase" className="tools-showcase">
      <div className="tools-container">
        <div className="tools-header">
          <h2 className="tools-title">Available Tools</h2>
          <p className="tools-subtitle">Choose a visualization to get started</p>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => onToolSelect(tool.name)}
              className="tool-card"
            >
              <div className={`tool-icon ${tool.color}`}>
                <span className="tool-icon-text">{tool.icon}</span>
              </div>
              <h3 className="tool-name">{tool.name}</h3>
              <p className="tool-description">{tool.description}</p>
              <div className="tool-indicator">
                <div className="indicator-dot"></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
