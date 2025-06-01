import React, { useState, useEffect } from 'react';
import { HashTable, createAlgorithm, calculateComplexity } from '../utils/hashingAlgorithms';

const AlgorithmComparison = ({ settings }) => {
  const [selectedKey, setSelectedKey] = useState('A');
  const [hashTables, setHashTables] = useState({});
  const [insertionResults, setInsertionResults] = useState({});
  const [currentAlgorithm, setCurrentAlgorithm] = useState('uniform');

  const algorithms = [
    { 
      id: 'uniform', 
      name: 'Uniform Probing', 
      color: 'bg-red-500',
      description: 'Traditional linear probing method'
    },
    { 
      id: 'elastic', 
      name: 'Elastic Hashing', 
      color: 'bg-hash-secondary',
      description: 'O(1) amortized, layered approach'
    },
    { 
      id: 'funnel', 
      name: 'Funnel Hashing', 
      color: 'bg-hash-accent',
      description: 'O(log²(1/δ)) worst-case, geometric structure'
    }
  ];

  useEffect(() => {
    // Initialize hash tables for all algorithms
    const newHashTables = {};
    algorithms.forEach(alg => {
      newHashTables[alg.id] = new HashTable(settings.tableSize);
    });
    setHashTables(newHashTables);
    setInsertionResults({});
  }, [settings.tableSize]);

  const simulateInsertion = (algorithmId, key) => {
    const hashTable = hashTables[algorithmId];
    if (!hashTable) return;

    const algorithm = createAlgorithm(algorithmId, settings.tableSize);
    const result = algorithm.insert(hashTable, key);
    
    setInsertionResults(prev => ({
      ...prev,
      [algorithmId]: result
    }));

    // Force re-render
    setHashTables(prev => ({ ...prev }));
  };

  const resetAllTables = () => {
    const newHashTables = {};
    algorithms.forEach(alg => {
      newHashTables[alg.id] = new HashTable(settings.tableSize);
    });
    setHashTables(newHashTables);
    setInsertionResults({});
  };

  const fillTableRandomly = (fillPercentage = 0.7) => {
    resetAllTables();
    const itemsToInsert = Math.floor(settings.tableSize * fillPercentage);
    
    algorithms.forEach(alg => {
      const hashTable = hashTables[alg.id] || new HashTable(settings.tableSize);
      const algorithm = createAlgorithm(alg.id, settings.tableSize);
      
      for (let i = 0; i < itemsToInsert; i++) {
        const key = String.fromCharCode(65 + (i % 26)) + Math.floor(i / 26);
        algorithm.insert(hashTable, key);
      }
    });
    
    setHashTables(prev => ({ ...prev }));
  };

  const renderHashTable = (algorithmId) => {
    const hashTable = hashTables[algorithmId];
    const result = insertionResults[algorithmId];
    const algorithm = algorithms.find(a => a.id === algorithmId);
    
    if (!hashTable) return null;

    return (
      <div className="complexity-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-hash-text">{algorithm.name}</h3>
          <div className="text-sm text-hash-muted">
            Load: {(hashTable.loadFactor * 100).toFixed(1)}% | δ: {hashTable.delta.toFixed(3)}
          </div>
        </div>
        
        <div className="grid grid-cols-8 gap-1 mb-4">
          {hashTable.table.map((cell, index) => {
            const isInProbeSequence = result?.steps?.some(step => step.position === index);
            const stepInfo = result?.steps?.find(step => step.position === index);
            
            return (
              <div
                key={index}
                className={`hash-table-cell ${
                  cell !== null ? 'occupied' : 'empty'
                } ${isInProbeSequence ? 'border-4 border-dashed border-purple-500' : ''}`}
                title={`Position ${index}${cell ? `: ${cell}` : ''}${
                  stepInfo ? ` (Probe #${stepInfo.probeNumber})` : ''
                }`}
              >
                <span className="text-xs">{cell || index}</span>
              </div>
            );
          })}
        </div>

        {result && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Probe Count:</span>
                <span className="ml-2 text-hash-primary font-mono">{result.probeCount}</span>
              </div>
              <div>
                <span className="font-medium">Success:</span>
                <span className={`ml-2 font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            
            <div className="mt-2">
              <span className="font-medium text-sm">Probe Sequence:</span>
              <div className="flex flex-wrap mt-1">
                {result.steps.map((step, i) => (
                  <span
                    key={i}
                    className={`probe-sequence-step ${step.success ? 'bg-green-500' : ''}`}
                  >
                    {step.position}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Theoretical Complexity</h4>
          {(() => {
            const complexity = calculateComplexity(algorithmId, hashTable.delta);
            return (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700">Amortized:</span>
                  <div className="font-mono text-blue-800">{complexity.notation.amortized}</div>
                </div>
                <div>
                  <span className="text-blue-700">Worst-case:</span>
                  <div className="font-mono text-blue-800">{complexity.notation.worstCase}</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="complexity-card">
        <h2 className="text-3xl font-bold text-hash-text mb-6">Algorithm Comparison</h2>
        <p className="text-hash-muted mb-6">
          Compare how different hashing algorithms handle insertions and probe sequences. 
          Use the controls below to insert elements and observe the differences.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-hash-text mb-2">
              Key to Insert
            </label>
            <input
              type="text"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hash-primary"
              placeholder="Enter key (e.g., A, B, C)"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => algorithms.forEach(alg => simulateInsertion(alg.id, selectedKey))}
              className="w-full bg-hash-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Insert into All Tables
            </button>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={resetAllTables}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={() => fillTableRandomly(0.7)}
              className="flex-1 bg-hash-accent text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Fill 70%
            </button>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {algorithms.map(algorithm => (
          <div key={algorithm.id}>
            {renderHashTable(algorithm.id)}
          </div>
        ))}
      </div>

      <section className="complexity-card">
        <h3 className="text-2xl font-semibold mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <h4 className="font-semibold text-red-800 mb-2">Uniform Probing</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Simple linear probe sequence</li>
              <li>• High probe counts as table fills</li>
              <li>• Clustering effects become severe</li>
              <li>• Θ(1/δ) worst-case complexity</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-hash-secondary">
            <h4 className="font-semibold text-green-800 mb-2">Elastic Hashing</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Layer-based probe sequences</li>
              <li>• O(1) amortized performance</li>
              <li>• Non-greedy insertion strategy</li>
              <li>• Decouples search complexity</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-hash-accent">
            <h4 className="font-semibold text-yellow-800 mb-2">Funnel Hashing</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Geometric sub-array structure</li>
              <li>• O(log²(1/δ)) worst-case</li>
              <li>• Greedy insertion with fallback</li>
              <li>• Significant improvement over uniform</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AlgorithmComparison; 