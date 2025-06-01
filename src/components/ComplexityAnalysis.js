import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from 'chart.js';
import { calculateComplexity, HashTable, createAlgorithm } from '../utils/hashingAlgorithms';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ComplexityAnalysis = ({ settings }) => {
  const [showTheory, setShowTheory] = useState(true);
  const [simulationData, setSimulationData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('probes');

  const deltaValues = useMemo(() => {
    const values = [];
    for (let i = 0.01; i <= 0.5; i += 0.02) {
      values.push(parseFloat(i.toFixed(3)));
    }
    return values;
  }, []);

  const runSimulation = async () => {
    setIsSimulating(true);
    const algorithms = ['uniform', 'elastic', 'funnel'];
    const results = {
      uniform: { deltaValues: [], avgProbes: [], maxProbes: [], successRate: [] },
      elastic: { deltaValues: [], avgProbes: [], maxProbes: [], successRate: [] },
      funnel: { deltaValues: [], avgProbes: [], maxProbes: [], successRate: [] }
    };

    for (const delta of deltaValues) {
      const tableSize = 64;
      const itemsToInsert = Math.floor(tableSize * (1 - delta));

      for (const algorithmType of algorithms) {
        const trials = 10;
        let totalProbes = 0;
        let maxProbes = 0;
        let successfulInsertions = 0;
        let totalInsertions = 0;

        for (let trial = 0; trial < trials; trial++) {
          const hashTable = new HashTable(tableSize);
          const algorithm = createAlgorithm(algorithmType, tableSize);

          for (let i = 0; i < itemsToInsert; i++) {
            const key = `key_${trial}_${i}`;
            const result = algorithm.insert(hashTable, key);
            
            totalInsertions++;
            totalProbes += result.probeCount;
            maxProbes = Math.max(maxProbes, result.probeCount);
            
            if (result.success) {
              successfulInsertions++;
            }
          }
        }

        results[algorithmType].deltaValues.push(delta);
        results[algorithmType].avgProbes.push(totalProbes / totalInsertions);
        results[algorithmType].maxProbes.push(maxProbes);
        results[algorithmType].successRate.push((successfulInsertions / totalInsertions) * 100);
      }

      // Add a small delay to prevent UI blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    setSimulationData(results);
    setIsSimulating(false);
  };

  const getTheoreticalData = () => {
    const data = {
      uniform: { deltaValues: [], avgProbes: [], maxProbes: [] },
      elastic: { deltaValues: [], avgProbes: [], maxProbes: [] },
      funnel: { deltaValues: [], avgProbes: [], maxProbes: [] }
    };

    deltaValues.forEach(delta => {
      const algorithms = ['uniform', 'elastic', 'funnel'];
      
      algorithms.forEach(alg => {
        const complexity = calculateComplexity(alg, delta);
        data[alg].deltaValues.push(delta);
        data[alg].avgProbes.push(complexity.amortized);
        data[alg].maxProbes.push(complexity.worstCase);
      });
    });

    return data;
  };

  const getChartData = () => {
    const theoreticalData = getTheoreticalData();
    const dataSource = showTheory ? theoreticalData : simulationData;
    
    if (!dataSource) return null;

    const metricKey = selectedMetric === 'probes' ? 'avgProbes' : 'maxProbes';

    return {
      labels: deltaValues.map(d => d.toFixed(2)),
      datasets: [
        {
          label: 'Uniform Probing',
          data: dataSource.uniform[metricKey],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Elastic Hashing',
          data: dataSource.elastic[metricKey],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Funnel Hashing',
          data: dataSource.funnel[metricKey],
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: false,
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedMetric === 'probes' ? 'Average' : 'Maximum'} Probe Complexity vs Delta (δ)`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} probes`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Delta (δ) - Remaining Capacity'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Probes'
        },
        type: showTheory && selectedMetric === 'max' ? 'logarithmic' : 'linear',
        min: 0,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="complexity-card">
        <h2 className="text-3xl font-bold text-hash-text mb-6">Complexity Analysis</h2>
        <p className="text-hash-muted mb-6">
          Analyze the theoretical and empirical performance of different hashing algorithms. 
          Compare how probe complexity changes with the load factor (δ).
        </p>
      </section>

      <section className="complexity-card">
        <h3 className="text-xl font-semibold mb-4">Interactive Charts</h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-hash-text mb-2">
              Data Source
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTheory(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showTheory
                    ? 'bg-hash-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Theoretical
              </button>
              <button
                onClick={() => setShowTheory(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showTheory
                    ? 'bg-hash-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Empirical
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-hash-text mb-2">
              Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hash-primary"
            >
              <option value="probes">Average Probes</option>
              <option value="max">Maximum Probes</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full bg-hash-secondary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSimulating ? 'Running Simulation...' : 'Run Empirical Simulation'}
            </button>
          </div>
        </div>

        {isSimulating && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">Running simulation across different load factors...</span>
            </div>
          </div>
        )}

        {!showTheory && !simulationData && !isSimulating && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <p className="text-yellow-800">
              Click "Run Empirical Simulation" to generate performance data from actual algorithm implementations.
            </p>
          </div>
        )}

        <div className="h-96">
          {getChartData() && <Line data={getChartData()} options={chartOptions} />}
        </div>
      </section>

      <section className="complexity-card">
        <h3 className="text-xl font-semibold mb-4">Complexity Comparison Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Algorithm</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Amortized Expected</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Worst-case Expected</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Key Innovation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-red-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">Uniform Probing</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-mono text-red-600">
                  Θ(log(1/δ))
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-mono text-red-600">
                  Θ(1/δ)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  Traditional linear probing - simple but inefficient
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">Elastic Hashing</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-mono text-green-600">
                  O(1)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-mono text-green-600">
                  O(log(1/δ))
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  Layered arrays, non-greedy strategy
                </td>
              </tr>
              
              <tr className="hover:bg-yellow-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">Funnel Hashing</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-mono text-yellow-600">
                  O(log²(1/δ))
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-mono text-yellow-600">
                  O(log²(1/δ))
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  Geometric sub-arrays, greedy with fallback
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="complexity-card">
        <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-hash-text mb-3">Theoretical Breakthroughs</h4>
            <ul className="space-y-2 text-sm text-hash-muted">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>
                  <strong>Elastic Hashing</strong> achieves O(1) amortized complexity, 
                  dramatically better than uniform probing's Θ(log(1/δ))
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>
                  <strong>Funnel Hashing</strong> provides O(log²(1/δ)) worst-case, 
                  exponentially better than uniform's Θ(1/δ)
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">i</span>
                <span>
                  Both algorithms maintain the "no reordering" constraint that made 
                  Yao's conjecture seemingly unbreakable
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-hash-text mb-3">Practical Implications</h4>
            <ul className="space-y-2 text-sm text-hash-muted">
              <li className="flex items-start space-x-2">
                <span className="text-hash-primary font-bold">⚡</span>
                <span>
                  Performance improvements become more significant as tables approach capacity
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-hash-primary font-bold">📊</span>
                <span>
                  Elastic hashing excels in scenarios with frequent insertions and searches
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-hash-primary font-bold">🛡️</span>
                <span>
                  Funnel hashing provides better worst-case guarantees for critical systems
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComplexityAnalysis; 