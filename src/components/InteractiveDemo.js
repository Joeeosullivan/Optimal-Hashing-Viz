import React, { useState, useEffect, useCallback } from 'react';
import { HashTable, createAlgorithm } from '../utils/hashingAlgorithms';

const InteractiveDemo = ({ settings, updateSettings }) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState('uniform');
  const [hashTable, setHashTable] = useState(null);
  const [insertionHistory, setInsertionHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [autoInsertMode, setAutoInsertMode] = useState(false);
  const [insertionStats, setInsertionStats] = useState({
    totalInsertions: 0,
    totalProbes: 0,
    averageProbes: 0,
    maxProbes: 0
  });

  const algorithms = [
    { id: 'uniform', name: 'Uniform Probing', color: 'bg-red-500' },
    { id: 'elastic', name: 'Elastic Hashing', color: 'bg-hash-secondary' },
    { id: 'funnel', name: 'Funnel Hashing', color: 'bg-hash-accent' }
  ];

  useEffect(() => {
    if (settings.tableSize) {
      setHashTable(new HashTable(settings.tableSize));
      setInsertionHistory([]);
      setInsertionStats({
        totalInsertions: 0,
        totalProbes: 0,
        averageProbes: 0,
        maxProbes: 0
      });
    }
  }, [settings.tableSize, currentAlgorithm]);

  const updateStats = useCallback((probeCount) => {
    setInsertionStats(prev => {
      const newTotal = prev.totalInsertions + 1;
      const newTotalProbes = prev.totalProbes + probeCount;
      return {
        totalInsertions: newTotal,
        totalProbes: newTotalProbes,
        averageProbes: newTotalProbes / newTotal,
        maxProbes: Math.max(prev.maxProbes, probeCount)
      };
    });
  }, []);

  const insertElement = async (key) => {
    if (isAnimating || !hashTable) return;
    
    setIsAnimating(true);
    const algorithm = createAlgorithm(currentAlgorithm, settings.tableSize);
    
    // First, get the probe sequence without actually inserting
    const probeSequence = algorithm.getProbeSequence(key);
    const steps = [];
    let finalInsertionPosition = -1;
    
    // Simulate the probing to find where we would insert
    for (let i = 0; i < probeSequence.length; i++) {
      const pos = probeSequence[i];
      const isOccupied = hashTable.isOccupied(pos);
      
      steps.push({
        position: pos,
        probeNumber: i + 1,
        success: false,
        occupied: isOccupied
      });
      
      if (!isOccupied) {
        finalInsertionPosition = pos;
        steps[steps.length - 1].success = true;
        break;
      }
    }

    // Create the result object for history
    const result = {
      steps,
      probeCount: steps.length,
      success: finalInsertionPosition !== -1
    };

    // Animate through probe steps WITHOUT showing the final value yet
    for (let i = 0; i < result.steps.length - 1; i++) { // Note: -1 to exclude final step
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, settings.animationSpeed / result.steps.length));
    }
    
    // Now actually insert the value if successful
    if (result.success) {
      hashTable.insert(finalInsertionPosition, key);
      
      // Show the final insertion step
      setCurrentStep(result.steps.length - 1);
      await new Promise(resolve => setTimeout(resolve, settings.animationSpeed / result.steps.length));
    }
    
    setInsertionHistory(prev => [...prev, { key, result, algorithm: currentAlgorithm }]);
    updateStats(result.probeCount);
    
    setCurrentStep(-1);
    setIsAnimating(false);
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)] + Math.floor(Math.random() * 100);
  };

  const autoInsert = useCallback(async () => {
    if (!autoInsertMode || !hashTable) return;
    
    const key = generateRandomKey();
    await insertElement(key);
    
    if (hashTable.loadFactor < 0.9) {
      setTimeout(autoInsert, settings.animationSpeed + 500);
    } else {
      setAutoInsertMode(false);
    }
  }, [autoInsertMode, hashTable?.loadFactor, settings.animationSpeed]);

  useEffect(() => {
    if (autoInsertMode) {
      autoInsert();
    }
  }, [autoInsertMode, autoInsert]);

  const resetDemo = () => {
    if (settings.tableSize) {
      setHashTable(new HashTable(settings.tableSize));
      setInsertionHistory([]);
      setCurrentStep(-1);
      setAutoInsertMode(false);
      setInsertionStats({
        totalInsertions: 0,
        totalProbes: 0,
        averageProbes: 0,
        maxProbes: 0
      });
    }
  };

  const renderHashTable = () => {
    if (!hashTable) return <div>Loading...</div>;
    
    const lastResult = insertionHistory[insertionHistory.length - 1]?.result;
    
    return (
      <div className="grid grid-cols-8 gap-1 mb-6">
        {hashTable.table.map((cell, index) => {
          const isCurrentStep = lastResult?.steps?.[currentStep]?.position === index;
          const wasProbed = lastResult?.steps?.some(step => step.position === index);
          const stepInfo = lastResult?.steps?.find(step => step.position === index);
          const isSuccessfulInsertion = stepInfo?.success && isCurrentStep;
          
          let cellClass = 'hash-table-cell ';
          
          if (cell !== null) {
            cellClass += 'occupied';
          } else if (isSuccessfulInsertion) {
            // This is the final insertion step - show as inserting
            cellClass += 'inserting animate-insert';
          } else if (isCurrentStep) {
            // This is a probing step - show as probing
            cellClass += 'probing animate-probe';
          } else {
            cellClass += 'empty';
          }
          
          // Add border for previously probed positions (but not current)
          if (wasProbed && !isCurrentStep) {
            cellClass += ' border-2 border-purple-400';
          }
          
          return (
            <div
              key={index}
              className={cellClass}
              title={`Position ${index}${cell ? `: ${cell}` : ''}${
                stepInfo ? ` (Probe #${stepInfo.probeNumber})` : ''
              }`}
            >
              <span className="text-xs font-mono">{cell || index}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Don't render if hashTable is not initialized
  if (!hashTable) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="complexity-card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hash-primary"></div>
            <span className="ml-3 text-hash-muted">Initializing hash table...</span>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="complexity-card">
        <h2 className="text-3xl font-bold text-hash-text mb-6">Interactive Demo</h2>
        <p className="text-hash-muted mb-6">
          Experiment with different algorithms and parameters to see how they perform in real-time. 
          Watch the probe sequences and analyze the statistics.
        </p>
      </section>

      {/* Controls */}
      <section className="complexity-card">
        <h3 className="text-xl font-semibold mb-4">Controls</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-hash-text mb-2">
              Algorithm
            </label>
            <select
              value={currentAlgorithm}
              onChange={(e) => setCurrentAlgorithm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hash-primary"
            >
              {algorithms.map(alg => (
                <option key={alg.id} value={alg.id}>{alg.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-hash-text mb-2">
              Table Size
            </label>
            <select
              value={settings.tableSize}
              onChange={(e) => updateSettings({ tableSize: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hash-primary"
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
              <option value={64}>64</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-hash-text mb-2">
              Animation Speed (ms)
            </label>
            <input
              type="range"
              min="500"
              max="3000"
              step="250"
              value={settings.animationSpeed}
              onChange={(e) => updateSettings({ animationSpeed: parseInt(e.target.value) })}
              className="w-full interactive-slider"
            />
            <div className="text-xs text-hash-muted mt-1">{settings.animationSpeed}ms</div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setAutoInsertMode(!autoInsertMode)}
              disabled={
                isAnimating || 
                (hashTable && 
                 typeof hashTable.loadFactor === 'number' && 
                 !isNaN(hashTable.loadFactor) && 
                 hashTable.loadFactor >= 0.9)
              }
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                autoInsertMode
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-hash-secondary text-white hover:bg-green-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {autoInsertMode ? 'Stop Auto Insert' : 'Start Auto Insert'}
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => insertElement(generateRandomKey())}
            disabled={
              isAnimating || 
              (hashTable && 
               typeof hashTable.loadFactor === 'number' && 
               !isNaN(hashTable.loadFactor) && 
               hashTable.loadFactor >= 1)
            }
            className="bg-hash-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Insert Random Element
          </button>
          
          <button
            onClick={resetDemo}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </section>

      {/* Hash Table Visualization */}
      <section className="complexity-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Hash Table Visualization</h3>
          <div className="text-sm text-hash-muted">
            Load Factor: {
              hashTable && typeof hashTable.loadFactor === 'number' && !isNaN(hashTable.loadFactor)
                ? (hashTable.loadFactor * 100).toFixed(1) 
                : '0.0'
            }% | 
            δ: {
              hashTable && typeof hashTable.delta === 'number' && !isNaN(hashTable.delta)
                ? hashTable.delta.toFixed(3) 
                : '1.000'
            } | 
            Algorithm: {algorithms.find(a => a.id === currentAlgorithm)?.name}
          </div>
        </div>
        
        {renderHashTable()}

        {isAnimating && currentStep >= 0 && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-800 font-medium">
                {insertionHistory[insertionHistory.length - 1]?.result?.steps?.[currentStep]?.success 
                  ? `Inserting at position ${insertionHistory[insertionHistory.length - 1]?.result?.steps?.[currentStep]?.position}` 
                  : `Probing position ${insertionHistory[insertionHistory.length - 1]?.result?.steps?.[currentStep]?.position} (Step ${currentStep + 1})`
                }
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Statistics */}
      <section className="complexity-card">
        <h3 className="text-xl font-semibold mb-4">Performance Statistics</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-800">{insertionStats.totalInsertions || 0}</div>
            <div className="text-blue-600 text-sm">Total Insertions</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800">
              {(insertionStats.averageProbes && !isNaN(insertionStats.averageProbes)) 
                ? insertionStats.averageProbes.toFixed(2) 
                : '0.00'
              }
            </div>
            <div className="text-green-600 text-sm">Average Probes</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-800">{insertionStats.maxProbes || 0}</div>
            <div className="text-yellow-600 text-sm">Max Probes</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-800">{insertionStats.totalProbes || 0}</div>
            <div className="text-purple-600 text-sm">Total Probes</div>
          </div>
        </div>
      </section>

      {/* Recent Insertions */}
      {insertionHistory.length > 0 && (
        <section className="complexity-card">
          <h3 className="text-xl font-semibold mb-4">Recent Insertions</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {insertionHistory.slice(-10).reverse().map((insertion, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-medium">{insertion.key}</span>
                  <span className="text-sm text-hash-muted">{insertion.algorithm}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-hash-muted">
                    {insertion.result.probeCount} probe{insertion.result.probeCount !== 1 ? 's' : ''}
                  </span>
                  <span className={`font-medium ${insertion.result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {insertion.result.success ? 'Success' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InteractiveDemo;