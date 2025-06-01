// Utility functions for simulating different hashing algorithms

export class HashTable {
  constructor(size) {
    this.size = size || 16;
    this.table = new Array(this.size).fill(null);
    this.occupied = 0;
  }

  get loadFactor() {
    if (this.size === 0) return 0;
    return this.occupied / this.size;
  }

  get delta() {
    return 1 - this.loadFactor;
  }

  reset() {
    this.table = new Array(this.size).fill(null);
    this.occupied = 0;
  }

  isOccupied(index) {
    return this.table[index] !== null;
  }

  insert(index, value) {
    if (!this.isOccupied(index)) {
      this.table[index] = value;
      this.occupied++;
      return true;
    }
    return false;
  }
}

// Simple hash function
export function simpleHash(key, tableSize) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % tableSize;
  }
  return Math.abs(hash);
}

// Uniform Probing (Linear probing for simplicity)
export class UniformProbing {
  constructor(tableSize) {
    this.tableSize = tableSize;
  }

  getProbeSequence(key, maxProbes = null) {
    const sequence = [];
    const startPos = simpleHash(key, this.tableSize);
    const limit = maxProbes || this.tableSize;
    
    for (let i = 0; i < limit; i++) {
      sequence.push((startPos + i) % this.tableSize);
    }
    
    return sequence;
  }

  insert(hashTable, key) {
    const probeSequence = this.getProbeSequence(key);
    const steps = [];
    
    for (let i = 0; i < probeSequence.length; i++) {
      const pos = probeSequence[i];
      steps.push({
        position: pos,
        probeNumber: i + 1,
        success: false,
        occupied: hashTable.isOccupied(pos)
      });
      
      if (!hashTable.isOccupied(pos)) {
        hashTable.insert(pos, key);
        steps[steps.length - 1].success = true;
        break;
      }
    }
    
    return {
      steps,
      probeCount: steps.length,
      success: steps[steps.length - 1]?.success || false
    };
  }
}

// Elastic Hashing (Simplified simulation)
export class ElasticHashing {
  constructor(tableSize) {
    this.tableSize = tableSize;
    this.layers = Math.ceil(Math.log2(tableSize));
  }

  getProbeSequence(key, maxProbes = null) {
    const sequence = [];
    const baseHash = simpleHash(key, this.tableSize);
    const limit = maxProbes || Math.min(this.tableSize, Math.log(1 / 0.05) * 2);
    
    // Layer-based probing with decreasing frequency
    for (let layer = 0; layer < this.layers && sequence.length < limit; layer++) {
      const layerSize = Math.pow(2, layer + 1);
      const step = Math.max(1, Math.floor(this.tableSize / layerSize));
      
      for (let i = 0; i < layerSize && sequence.length < limit; i++) {
        const pos = (baseHash + i * step) % this.tableSize;
        if (!sequence.includes(pos)) {
          sequence.push(pos);
        }
      }
    }
    
    return sequence;
  }

  insert(hashTable, key) {
    const probeSequence = this.getProbeSequence(key);
    const steps = [];
    
    for (let i = 0; i < probeSequence.length; i++) {
      const pos = probeSequence[i];
      steps.push({
        position: pos,
        probeNumber: i + 1,
        success: false,
        occupied: hashTable.isOccupied(pos),
        layer: Math.floor(Math.log2(i + 1))
      });
      
      if (!hashTable.isOccupied(pos)) {
        hashTable.insert(pos, key);
        steps[steps.length - 1].success = true;
        break;
      }
    }
    
    return {
      steps,
      probeCount: steps.length,
      success: steps[steps.length - 1]?.success || false,
      algorithm: 'elastic'
    };
  }
}

// Funnel Hashing (Simplified simulation)
export class FunnelHashing {
  constructor(tableSize) {
    this.tableSize = tableSize;
    this.funnelLevels = Math.ceil(Math.log2(Math.log2(1 / 0.05)));
  }

  getProbeSequence(key, maxProbes = null) {
    const sequence = [];
    const baseHash = simpleHash(key, this.tableSize);
    const limit = maxProbes || Math.min(this.tableSize, Math.pow(Math.log(1 / 0.05), 2));
    
    // Geometric sub-arrays with funnel structure
    for (let level = 0; level < this.funnelLevels && sequence.length < limit; level++) {
      const levelSize = Math.pow(2, level);
      const step = Math.max(1, Math.floor(this.tableSize / (levelSize * 2)));
      
      for (let i = 0; i < levelSize && sequence.length < limit; i++) {
        const pos = (baseHash + i * step + level * 3) % this.tableSize;
        if (!sequence.includes(pos)) {
          sequence.push(pos);
        }
      }
    }
    
    return sequence;
  }

  insert(hashTable, key) {
    const probeSequence = this.getProbeSequence(key);
    const steps = [];
    
    for (let i = 0; i < probeSequence.length; i++) {
      const pos = probeSequence[i];
      const level = Math.floor(Math.log2(i + 1));
      
      steps.push({
        position: pos,
        probeNumber: i + 1,
        success: false,
        occupied: hashTable.isOccupied(pos),
        funnelLevel: level
      });
      
      if (!hashTable.isOccupied(pos)) {
        hashTable.insert(pos, key);
        steps[steps.length - 1].success = true;
        break;
      }
    }
    
    return {
      steps,
      probeCount: steps.length,
      success: steps[steps.length - 1]?.success || false,
      algorithm: 'funnel'
    };
  }
}

// Algorithm factory
export function createAlgorithm(type, tableSize) {
  switch (type) {
    case 'uniform':
      return new UniformProbing(tableSize);
    case 'elastic':
      return new ElasticHashing(tableSize);
    case 'funnel':
      return new FunnelHashing(tableSize);
    default:
      throw new Error(`Unknown algorithm type: ${type}`);
  }
}

// Complexity calculation utilities
export function calculateComplexity(algorithm, delta) {
  switch (algorithm) {
    case 'uniform':
      return {
        amortized: Math.log(1 / delta),
        worstCase: 1 / delta,
        notation: {
          amortized: 'Θ(log(1/δ))',
          worstCase: 'Θ(1/δ)'
        }
      };
    case 'elastic':
      return {
        amortized: 1,
        worstCase: Math.log(1 / delta),
        notation: {
          amortized: 'O(1)',
          worstCase: 'O(log(1/δ))'
        }
      };
    case 'funnel':
      return {
        amortized: Math.pow(Math.log(1 / delta), 2),
        worstCase: Math.pow(Math.log(1 / delta), 2),
        notation: {
          amortized: 'O(log²(1/δ))',
          worstCase: 'O(log²(1/δ))'
        }
      };
    default:
      return { amortized: 0, worstCase: 0 };
  }
} 