import React, { useState } from 'react';
import './App.css';
import { Hero } from './components/modern/Hero';
import { ToolsShowcase } from './components/modern/ToolsShowcase';
import { InteractiveArea } from './components/modern/InteractiveArea';

function App() {
  const [selectedTool, setSelectedTool] = useState(null);

  const scrollToInteractive = (toolName) => {
    setSelectedTool(toolName);
    const element = document.getElementById('interactive-area');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="modern-app">
      <Hero />
      <ToolsShowcase onToolSelect={scrollToInteractive} />
      <InteractiveArea selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

export default App;
