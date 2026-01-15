import React from 'react';
import './ModernStyles.css';

// Import your existing algorithm components
import BubbleSort from '../BubbleSort';
import SelectionSort from '../SelectionSort';
import InsertionSort from '../InsertionSort';
import ShellSort from '../ShellSort';
import MergeSort from '../MergeSort';
import BottomUpMergeSort from '../BottomUpMergeSort';
import QuickSort from '../QuickSort';
import Timsort from '../Timsort';
import RadixSort from '../RadixSort';
import CountingSort from '../CountingSort';
import BinarySearchTree from '../BinarySearchTree';
import MaxHeap from '../MaxHeap';
import MinHeap from '../MinHeap';
import LLRBTree from '../LLRBTree';

export function InteractiveArea({ selectedTool, setSelectedTool }) {
  const renderContent = () => {
    switch (selectedTool) {
      case 'Sorting Algorithms':
        return <SortingAlgorithmsView />;
      case 'Binary Search Tree':
        return <BinarySearchTree />;
      case 'Heaps':
        return <HeapsView />;
      case 'Red-Black Tree':
        return <LLRBTree />;
      default:
        return (
          <div className="empty-state">
            <p className="empty-message">Select a tool from above to get started</p>
          </div>
        );
    }
  };

  return (
    <div id="interactive-area" className="interactive-area">
      <div className="interactive-container">
        {selectedTool && (
          <div className="interactive-header">
            <h2 className="interactive-title">{selectedTool}</h2>
            <button
              onClick={() => setSelectedTool(null)}
              className="close-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <div className="interactive-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Sub-views for grouping related algorithms
function SortingAlgorithmsView() {
  const [activeSort, setActiveSort] = React.useState('bubble');

  const sortingAlgorithms = [
    { id: 'bubble', name: 'Bubble Sort', component: BubbleSort },
    { id: 'selection', name: 'Selection Sort', component: SelectionSort },
    { id: 'insertion', name: 'Insertion Sort', component: InsertionSort },
    { id: 'shell', name: 'Shell Sort', component: ShellSort },
    { id: 'merge', name: 'Merge Sort', component: MergeSort },
    { id: 'bottomUpMerge', name: 'Bottom-Up Merge', component: BottomUpMergeSort },
    { id: 'quick', name: 'QuickSort', component: QuickSort },
    { id: 'timsort', name: 'Timsort', component: Timsort },
    { id: 'radix', name: 'Radix Sort', component: RadixSort },
    { id: 'counting', name: 'Counting Sort', component: CountingSort },
  ];

  const ActiveComponent = sortingAlgorithms.find(alg => alg.id === activeSort)?.component || BubbleSort;

  return (
    <div className="sub-view">
      <nav className="sub-nav">
        {sortingAlgorithms.map(alg => (
          <button
            key={alg.id}
            className={`sub-nav-btn ${activeSort === alg.id ? 'active' : ''}`}
            onClick={() => setActiveSort(alg.id)}
          >
            {alg.name}
          </button>
        ))}
      </nav>
      <div className="sub-content">
        <ActiveComponent />
      </div>
    </div>
  );
}

function HeapsView() {
  const [activeHeap, setActiveHeap] = React.useState('max');

  return (
    <div className="sub-view">
      <nav className="sub-nav">
        <button
          className={`sub-nav-btn ${activeHeap === 'max' ? 'active' : ''}`}
          onClick={() => setActiveHeap('max')}
        >
          Max Heap
        </button>
        <button
          className={`sub-nav-btn ${activeHeap === 'min' ? 'active' : ''}`}
          onClick={() => setActiveHeap('min')}
        >
          Min Heap
        </button>
      </nav>
      <div className="sub-content">
        {activeHeap === 'max' ? <MaxHeap /> : <MinHeap />}
      </div>
    </div>
  );
}
