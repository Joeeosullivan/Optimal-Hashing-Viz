import React from 'react';

const ProblemExplanation = ({ settings }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="complexity-card">
        <h2 className="text-3xl font-bold text-hash-text mb-6">The Open Addressing Problem</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">What is Open Addressing?</h3>
            <p className="text-hash-muted mb-4">
              Open addressing is a hash table collision resolution method where all elements are stored directly in the hash table array. When a collision occurs, we probe for the next available slot using a predetermined sequence.
            </p>
            <p className="text-hash-muted mb-4">
              <strong>Key constraint:</strong> No reordering of elements is allowed after insertion.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Basic Hash Table Visualization</h4>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className="hash-table-cell empty">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm text-hash-muted mt-2">Empty hash table with {settings.tableSize} slots</p>
          </div>
        </div>
      </section>

      {/* Key Definitions */}
      <section className="complexity-card">
        <h2 className="text-2xl font-bold text-hash-text mb-6">Key Definitions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-hash-primary">
            <h3 className="font-semibold text-hash-primary mb-2">δ (Delta)</h3>
            <p className="text-sm text-hash-muted">
              The load factor representing how full the hash table is. 
              <span className="block mt-1 font-mono">δ = n/m</span>
              where n = elements, m = table size
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-hash-secondary">
            <h3 className="font-semibold text-hash-secondary mb-2">Probe Complexity</h3>
            <p className="text-sm text-hash-muted">
              The number of table positions examined during insertion or lookup operations.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-hash-accent">
            <h3 className="font-semibold text-hash-accent mb-2">Uniform Probing</h3>
            <p className="text-sm text-hash-muted">
              Traditional method where probe sequences are independent random permutations.
            </p>
          </div>
        </div>
      </section>

      {/* Prior Limitations */}
      <section className="complexity-card">
        <h2 className="text-2xl font-bold text-hash-text mb-6">Prior Limitations & Yao's Conjecture</h2>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              🚫 Traditional Uniform Probing Limitations
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-red-700 mb-2">Amortized Complexity</h4>
                <p className="text-red-600 font-mono text-lg">Θ(log(1/δ))</p>
                <p className="text-sm text-red-600 mt-1">
                  Expected number of probes per operation grows logarithmically as table fills up
                </p>
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-2">Worst-case Complexity</h4>
                <p className="text-red-600 font-mono text-lg">Θ(1/δ)</p>
                <p className="text-sm text-red-600 mt-1">
                  In worst case, may need to probe most of the table
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🤔 Yao's 1985 Conjecture
            </h3>
            <p className="text-blue-700 mb-3">
              "Uniform hashing is optimal for open addressing without reordering"
            </p>
            <p className="text-sm text-blue-600">
              For decades, this conjecture suggested that the limitations above were fundamental and unavoidable.
            </p>
          </div>
        </div>
      </section>

      {/* Research Breakthrough */}
      <section className="complexity-card bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-2xl font-bold text-hash-text mb-6">🎉 Research Breakthrough</h2>
        <div className="space-y-4">
          <p className="text-lg text-hash-text">
            Farach-Colton, Krapivin, and Kuszmaul proved that Yao's conjecture was <strong>wrong</strong> by introducing two revolutionary algorithms:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-hash-secondary">
              <h3 className="text-xl font-semibold text-hash-secondary mb-3">🔄 Elastic Hashing</h3>
              <ul className="space-y-2 text-sm text-hash-muted">
                <li>• <strong>O(1)</strong> amortized expected probe complexity</li>
                <li>• <strong>O(log(1/δ))</strong> worst-case expected</li>
                <li>• Non-greedy strategy with layered arrays</li>
                <li>• Decouples insertion and search complexity</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-hash-accent">
              <h3 className="text-xl font-semibold text-hash-accent mb-3">🔼 Funnel Hashing</h3>
              <ul className="space-y-2 text-sm text-hash-muted">
                <li>• <strong>O(log²(1/δ))</strong> worst-case complexity</li>
                <li>• Greedy strategy with geometric sub-arrays</li>
                <li>• Robust auxiliary structure fallback</li>
                <li>• Significant improvement over Θ(1/δ)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProblemExplanation; 