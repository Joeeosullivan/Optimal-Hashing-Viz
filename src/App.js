import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProblemExplanation from './components/ProblemExplanation';
import ImplementationOverview from './components/ImplementationOverview';
import AlgorithmComparison from './components/AlgorithmComparison';
import InteractiveDemo from './components/InteractiveDemo';
import ComplexityAnalysis from './components/ComplexityAnalysis';
import Footer from './components/Footer';

const SECTIONS = {
  PROBLEM: 'problem',
  IMPLEMENTATION: 'implementation',
  COMPARISON: 'comparison',
  DEMO: 'demo',
  ANALYSIS: 'analysis'
};

function App() {
  const [currentSection, setCurrentSection] = useState(SECTIONS.PROBLEM);
  const [globalSettings, setGlobalSettings] = useState({
    tableSize: 16,
    delta: 0.05,
    animationSpeed: 1000,
    showTheory: true
  });

  const updateSettings = (newSettings) => {
    setGlobalSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-hash-background">
      <Header />
      <Navigation 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
        sections={SECTIONS}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentSection === SECTIONS.PROBLEM && (
          <ProblemExplanation settings={globalSettings} />
        )}
        
        {currentSection === SECTIONS.IMPLEMENTATION && (
          <ImplementationOverview settings={globalSettings} />
        )}
        
        {currentSection === SECTIONS.COMPARISON && (
          <AlgorithmComparison settings={globalSettings} />
        )}
        
        {currentSection === SECTIONS.DEMO && (
          <InteractiveDemo 
            settings={globalSettings} 
            updateSettings={updateSettings}
          />
        )}
        
        {currentSection === SECTIONS.ANALYSIS && (
          <ComplexityAnalysis settings={globalSettings} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 