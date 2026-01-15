# Data Structures & Algorithm Visualizations

> A personal learning project to help me understand and visualize data structures and algorithms through interactive animations.

An interactive web application built with React that provides step-by-step visualizations of various data structures and algorithms. Created as a learning tool to deeply understand how these fundamental concepts work internally.

---

## 🎯 Purpose

This project was created for **personal educational purposes** to:

- Deepen my understanding of data structures and algorithms
- Learn through building and visualizing complex concepts
- Create an interactive reference tool for algorithm study
- Practice React development and UI/UX design
- Build a portfolio piece demonstrating technical skills

---

## ✨ Features

- **Interactive Visualizations** - Step-by-step animations showing algorithm execution
- **Modern UI** - Clean, dark-themed interface with smooth animations
- **Animation Controls** - Play, pause, step forward, reset, and speed adjustment
- **Multiple Categories** - Sorting algorithms, trees, and heaps
- **Auto-play** - Algorithms start animating automatically after operations
- **Real-time Statistics** - Track rotations, color flips, and other operations
- **Responsive Design** - Works on various screen sizes

---

## 📚 Implemented Algorithms

### 🔢 Sorting Algorithms (10)

- **Bubble Sort** - Basic comparison-based sorting
- **Selection Sort** - Minimum element selection
- **Insertion Sort** - Building sorted portion
- **Shell Sort** - Gap-based optimization
- **Merge Sort** - Divide and conquer (recursive)
- **Bottom-Up Merge Sort** - Iterative merge sort
- **QuickSort** - Sedgewick 2-way partitioning
- **Timsort** - Hybrid insertion + merge sort
- **Radix Sort** - LSD with bucket visualization
- **Counting Sort** - Frequency-based sorting

### 🌳 Tree Data Structures (4)

- **Binary Search Tree** - Insert, delete, and traversals (InOrder, PreOrder, PostOrder)
- **Max Heap** - Insert and delete max with heapify operations
- **Min Heap** - Insert and delete min with heapify operations
- **Left-Leaning Red-Black Tree** - Self-balancing BST with rotation and color flip tracking

---

## 🛠 Tech Stack

- **React 18.2.0** - Frontend framework
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Custom styling with gradients and animations
- **SVG** - Tree and graph visualizations
- **React Hooks** - useState, useEffect, useRef for state management

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/najtms/ds-algo-visualizer.git
cd ds-algo-visualizer
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

---

## 🎮 How to Use

1. **Landing Page** - Scroll down or click "Explore Tools"
2. **Choose a Category** - Select from Sorting Algorithms, Binary Search Tree, Heaps, or Red-Black Tree
3. **Select Algorithm** - Choose a specific algorithm from the sub-navigation
4. **Input Data** - Enter values or use the default random array
5. **Watch Animation** - Algorithms auto-play after operations (insert/delete/sort)
6. **Use Controls** - Pause, step forward, reset, or adjust speed as needed

---

## 🎨 Design Philosophy

### Animation System

- Each algorithm generates a list of "steps" (JSON objects)
- React animates these steps sequentially
- Each step represents a single operation (compare, swap, insert, etc.)
- Color-coded states for clear visual feedback

### Color Conventions

| Color     | Meaning                           |
| --------- | --------------------------------- |
| 🟡 Yellow | Comparing elements                |
| 🔵 Blue   | Active element / Swapping         |
| 🟣 Purple | Currently selected / Key element  |
| 🟢 Green  | Sorted / Successfully placed      |
| 🔴 Red    | Deleting / Removing               |
| 🟠 Orange | Current range / Min element       |
| 🟦 Cyan   | Gap groups / Bucket visualization |

---

## 📂 Project Structure

```
Project-DS/
├── public/
│   ├── index.html
│   └── icon.png
├── src/
│   ├── components/
│   │   ├── modern/           # Modern UI components
│   │   │   ├── Hero.js
│   │   │   ├── ToolsShowcase.js
│   │   │   ├── InteractiveArea.js
│   │   │   └── ModernStyles.css
│   │   ├── AnimationControls.js    # Shared control panel
│   │   ├── BubbleSort.js           # Sorting algorithms
│   │   ├── SelectionSort.js
│   │   ├── InsertionSort.js
│   │   ├── ShellSort.js
│   │   ├── MergeSort.js
│   │   ├── BottomUpMergeSort.js
│   │   ├── QuickSort.js
│   │   ├── Timsort.js
│   │   ├── RadixSort.js
│   │   ├── CountingSort.js
│   │   ├── BinarySearchTree.js     # Tree structures
│   │   ├── MaxHeap.js
│   │   ├── MinHeap.js
│   │   └── LLRBTree.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

---

## 🔮 Future Enhancements

Potential features I'd like to add:

- [ ] More algorithms (Dijkstra's, Kruskal's, Prim's)
- [ ] Graph algorithms and visualizations
- [ ] Hash tables with collision resolution
- [ ] Code snippets alongside visualizations
- [ ] Complexity analysis display (time/space)
- [ ] Side-by-side algorithm comparison
- [ ] Mobile touch controls
- [ ] Dark/light theme toggle
- [ ] Algorithm explanations and tutorials
- [ ] Performance benchmarking

---

## 📝 What I Learned

Through building this project, I gained hands-on experience with:

- **Algorithm Implementation** - Deep understanding of sorting and tree algorithms
- **React Architecture** - Component composition and state management
- **Animation Timing** - Using setTimeout and useEffect for controlled animations
- **SVG Manipulation** - Drawing dynamic tree structures
- **UI/UX Design** - Creating intuitive controls and visual feedback
- **Code Organization** - Structuring a large React application
- **Problem Solving** - Debugging complex animation sequences

---

## 🙏 Acknowledgments

This project was inspired by:

- Algorithm visualization tools like VisuAlgo and Algorithm Visualizer
- Robert Sedgewick's "Algorithms" course and book
- The need for a personal, customizable learning tool

---

## 📄 License

This is a personal learning project. Feel free to use it for educational purposes.

---

## 👤 Author

Created as a personal project for learning and understanding data structures and algorithms.

**GitHub:** [Your GitHub Profile](https://github.com/najtms)

---

_Built with ❤️ and a desire to deeply understand algorithms_
