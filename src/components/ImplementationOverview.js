import React from 'react';

const ImplementationOverview = () => {
  const CodeBlock = ({ children, title }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {title && <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>}
      <pre className="text-sm font-mono text-gray-800 overflow-x-auto">{children}</pre>
    </div>
  );

  const ExampleTable = ({ positions, title, description }) => (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="grid grid-cols-8 gap-1">
        {positions.map((pos, index) => {
          let cellClass = 'w-12 h-12 border rounded flex items-center justify-center text-xs font-mono ';
          
          if (pos.probed && pos.occupied) {
            // Cell was probed and is occupied - show occupied with yellow border to indicate probing
            cellClass += 'bg-blue-500 text-white border-2 border-yellow-400';
          } else if (pos.probed && !pos.occupied) {
            // Cell was probed but empty - show yellow background
            cellClass += 'bg-yellow-200 border-yellow-400';
          } else if (pos.occupied) {
            // Cell is occupied but wasn't probed - show normal blue
            cellClass += 'bg-blue-500 text-white border-gray-300';
          } else {
            // Empty cell that wasn't probed
            cellClass += 'bg-white border-gray-300';
          }
          
          return (
            <div key={index} className={cellClass}>
              {pos.value || index}
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <span className="inline-block w-3 h-3 bg-blue-500 mr-1"></span>Occupied
        <span className="inline-block w-3 h-3 bg-yellow-200 border border-yellow-400 mr-1 ml-3"></span>Probed
        <span className="inline-block w-3 h-3 bg-blue-500 border-2 border-yellow-400 mr-1 ml-3"></span>Occupied + Probed
        <span className="inline-block w-3 h-3 bg-white border border-gray-300 mr-1 ml-3"></span>Empty
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="complexity-card">
        <h2 className="text-3xl font-bold text-hash-text mb-6">Implementation Overview</h2>
        <p className="text-hash-muted mb-6">
          Detailed explanation of how each algorithm works internally, with step-by-step examples 
          and implementation details to understand the theoretical improvements.
        </p>
      </section>

      {/* Uniform Probing */}
      <section className="complexity-card">
        <div className="flex items-center mb-6">
          <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
          <h3 className="text-2xl font-bold">Uniform Probing (Linear Probing)</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">How It Works</h4>
            <p className="text-gray-700 mb-4">
              The simplest open addressing scheme. When a collision occurs, we simply check 
              the next position in sequence (with wraparound).
            </p>
            
            <CodeBlock title="Probe Sequence Generation">
{`function getProbeSequence(key, tableSize) {
  const startPos = hash(key) % tableSize;
  const sequence = [];
  
  for (let i = 0; i < tableSize; i++) {
    sequence.push((startPos + i) % tableSize);
  }
  
  return sequence;
}`}
            </CodeBlock>

            <div className="mt-4">
              <h5 className="font-semibold mb-2">Key Characteristics:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Deterministic sequence: h(k), h(k)+1, h(k)+2, ...</li>
                <li>• Simple to implement and understand</li>
                <li>• Suffers from clustering at high load factors</li>
                <li>• Expected probes: 1/δ for unsuccessful search</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Motivated Example</h4>
            <p className="text-sm text-gray-600 mb-4">
              Table size 8, δ = 0.25 (75% full). Inserting key "X" that hashes to position 2.
            </p>

            <ExampleTable
              title="Initial State"
              description="Positions 2, 3, 4, 5, 6 are occupied"
              positions={[
                { value: null, occupied: false, probed: false },
                { value: null, occupied: false, probed: false },
                { value: 'A', occupied: true, probed: false },
                { value: 'B', occupied: true, probed: false },
                { value: 'C', occupied: true, probed: false },
                { value: 'D', occupied: true, probed: false },
                { value: 'E', occupied: true, probed: false },
                { value: null, occupied: false, probed: false }
              ]}
            />

            <ExampleTable
              title="After Probing"
              description="Checks positions 2→3→4→5→6→7, finds empty slot at position 7"
              positions={[
                { value: null, occupied: false, probed: false },
                { value: null, occupied: false, probed: false },
                { value: 'A', occupied: true, probed: true },
                { value: 'B', occupied: true, probed: true },
                { value: 'C', occupied: true, probed: true },
                { value: 'D', occupied: true, probed: true },
                { value: 'E', occupied: true, probed: true },
                { value: 'X', occupied: true, probed: true }
              ]}
            />

            <div className="bg-red-50 p-3 rounded border border-red-200 mt-4">
              <p className="text-sm text-red-800">
                <strong>Problem:</strong> Required 6 probes due to clustering. 
                Long sequences of occupied cells create "traffic jams."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Elastic Hashing */}
      <section className="complexity-card">
        <div className="flex items-center mb-6">
          <div className="w-4 h-4 bg-hash-secondary rounded mr-3"></div>
          <h3 className="text-2xl font-bold">Elastic Hashing</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">How It Works</h4>
            <p className="text-gray-700 mb-4">
              Uses a layered approach with decreasing probe density. Each layer has 
              a different step size, spreading probes more evenly across the table.
            </p>
            
            <CodeBlock title="Elastic Probe Generation">
{`function getProbeSequence(key, tableSize) {
  const sequence = [];
  const baseHash = hash(key) % tableSize;
  const layers = Math.ceil(Math.log2(tableSize));
  
  for (let layer = 0; layer < layers; layer++) {
    const layerSize = Math.pow(2, layer + 1);
    const step = Math.floor(tableSize / layerSize);
    
    for (let i = 0; i < layerSize; i++) {
      const pos = (baseHash + i * step) % tableSize;
      if (!sequence.includes(pos)) {
        sequence.push(pos);
      }
    }
  }
  
  return sequence;
}`}
            </CodeBlock>

            <div className="mt-4">
              <h5 className="font-semibold mb-2">Key Innovations:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Multi-layered probing with geometric progression</li>
                <li>• Avoids clustering by varying step sizes</li>
                <li>• O(1) amortized, O(log(1/δ)) worst-case</li>
                <li>• Better cache locality than random probing</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Motivated Example</h4>
            <p className="text-sm text-gray-600 mb-4">
              Same scenario: Table size 8, δ = 0.25, inserting "X" (hash = 2).
            </p>

            <div className="mb-4">
              <h5 className="text-sm font-semibold mb-2">Layer Structure:</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Layer 0: step=4, positions: 2, 6</div>
                <div>Layer 1: step=2, positions: 2, 4, 6, 0</div>
                <div>Layer 2: step=1, positions: 2, 3, 4, 5, 6, 7, 0, 1</div>
              </div>
            </div>

            <ExampleTable
              title="Elastic Probing Sequence"
              description="Checks 2→6→4→0, finds empty slot at position 0 in just 4 probes"
              positions={[
                { value: 'X', occupied: true, probed: true },
                { value: null, occupied: false, probed: false },
                { value: 'A', occupied: true, probed: true },
                { value: 'B', occupied: true, probed: false },
                { value: 'C', occupied: true, probed: true },
                { value: 'D', occupied: true, probed: false },
                { value: 'E', occupied: true, probed: true },
                { value: null, occupied: false, probed: false }
              ]}
            />

            <div className="bg-green-50 p-3 rounded border border-green-200 mt-4">
              <p className="text-sm text-green-800">
                <strong>Improvement:</strong> Only 4 probes vs 6 with uniform probing. 
                Layered approach avoids the clustering problem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funnel Hashing */}
      <section className="complexity-card">
        <div className="flex items-center mb-6">
          <div className="w-4 h-4 bg-hash-accent rounded mr-3"></div>
          <h3 className="text-2xl font-bold">Funnel Hashing</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">How It Works</h4>
            <p className="text-gray-700 mb-4">
              Organizes probes into geometric sub-arrays forming a "funnel" structure. 
              Each level has exponentially more positions but with careful spacing.
            </p>
            
            <CodeBlock title="Funnel Probe Generation">
{`function getProbeSequence(key, tableSize) {
  const sequence = [];
  const baseHash = hash(key) % tableSize;
  const levels = Math.ceil(Math.log2(Math.log2(1/δ)));
  
  for (let level = 0; level < levels; level++) {
    const levelSize = Math.pow(2, level);
    const step = Math.floor(tableSize / (levelSize * 2));
    
    for (let i = 0; i < levelSize; i++) {
      const pos = (baseHash + i * step + level * 3) 
                  % tableSize;
      if (!sequence.includes(pos)) {
        sequence.push(pos);
      }
    }
  }
  
  return sequence;
}`}
            </CodeBlock>

            <div className="mt-4">
              <h5 className="font-semibold mb-2">Key Features:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Funnel-shaped probe distribution</li>
                <li>• O(log²(1/δ)) worst-case guarantee</li>
                <li>• Geometric sub-array organization</li>
                <li>• Optimal for worst-case scenarios</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Motivated Example</h4>
            <p className="text-sm text-gray-600 mb-4">
              Same scenario: Table size 8, δ = 0.25, inserting "X" (hash = 2).
            </p>

            <div className="mb-4">
              <h5 className="text-sm font-semibold mb-2">Funnel Levels:</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Level 0: size=1, positions: 2</div>
                <div>Level 1: size=2, positions: 5, 0</div>
                <div>Level 2: size=4, positions: 1, 2, 3, 4</div>
              </div>
            </div>

            <ExampleTable
              title="Funnel Probing Sequence"
              description="Checks 2→5→0, finds empty slot at position 0 in just 3 probes"
              positions={[
                { value: 'X', occupied: true, probed: true },
                { value: null, occupied: false, probed: false },
                { value: 'A', occupied: true, probed: true },
                { value: 'B', occupied: true, probed: false },
                { value: 'C', occupied: true, probed: false },
                { value: 'D', occupied: true, probed: true },
                { value: 'E', occupied: true, probed: false },
                { value: null, occupied: false, probed: false }
              ]}
            />

            <div className="bg-purple-50 p-3 rounded border border-purple-200 mt-4">
              <p className="text-sm text-purple-800">
                <strong>Best Case:</strong> Only 3 probes! Funnel structure 
                provides excellent worst-case guarantees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Summary */}
      <section className="complexity-card">
        <h3 className="text-2xl font-bold mb-6">Algorithm Comparison Summary</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left">Algorithm</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Amortized</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Worst-Case</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Key Advantage</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Main Drawback</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Uniform Probing</td>
                <td className="border border-gray-300 px-4 py-3">Θ(log(1/δ))</td>
                <td className="border border-gray-300 px-4 py-3 text-red-600">Θ(1/δ)</td>
                <td className="border border-gray-300 px-4 py-3">Simple, cache-friendly</td>
                <td className="border border-gray-300 px-4 py-3">Clustering, poor worst-case</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Elastic Hashing</td>
                <td className="border border-gray-300 px-4 py-3 text-green-600">O(1)</td>
                <td className="border border-gray-300 px-4 py-3 text-green-600">O(log(1/δ))</td>
                <td className="border border-gray-300 px-4 py-3">Constant amortized time</td>
                <td className="border border-gray-300 px-4 py-3">More complex implementation</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">Funnel Hashing</td>
                <td className="border border-gray-300 px-4 py-3">O(log²(1/δ))</td>
                <td className="border border-gray-300 px-4 py-3 text-blue-600">O(log²(1/δ))</td>
                <td className="border border-gray-300 px-4 py-3">Best worst-case guarantee</td>
                <td className="border border-gray-300 px-4 py-3">Higher constant factors</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">When to Use Uniform Probing</h4>
            <p className="text-sm text-blue-700">
              Low to moderate load factors, simple requirements, 
              when cache locality is crucial.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">When to Use Elastic Hashing</h4>
            <p className="text-sm text-green-700">
              High-performance applications needing constant amortized time, 
              when average case matters most.
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">When to Use Funnel Hashing</h4>
            <p className="text-sm text-purple-700">
              Real-time systems requiring predictable worst-case performance, 
              safety-critical applications.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Notes */}
      <section className="complexity-card">
        <h3 className="text-2xl font-bold mb-6">Implementation Notes</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Practical Considerations</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-hash-primary mr-2">•</span>
                <span><strong>Hash Function Quality:</strong> All algorithms benefit from good hash functions with uniform distribution.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hash-primary mr-2">•</span>
                <span><strong>Load Factor Management:</strong> Keep δ &gt; 0.1 for reasonable performance across all algorithms.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hash-primary mr-2">•</span>
                <span><strong>Memory Layout:</strong> Elastic and Funnel hashing may have less predictable access patterns.</span>
              </li>
              <li className="flex items-start">
                <span className="text-hash-primary mr-2">•</span>
                <span><strong>Implementation Complexity:</strong> Trade-off between theoretical guarantees and code simplicity.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Research Impact</h4>
            <p className="text-gray-700 mb-4">
              This work breaks the decades-old assumption that uniform hashing is optimal for open addressing, 
              opening new avenues for hash table design.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 className="font-semibold text-yellow-800 mb-2">Key Breakthrough</h5>
              <p className="text-sm text-yellow-700">
                The paper disproves Yao's 1985 conjecture by showing that non-uniform 
                probe sequences can achieve better bounds than uniform hashing, 
                fundamentally changing our understanding of hash table performance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImplementationOverview; 