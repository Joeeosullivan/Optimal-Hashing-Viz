# Optimal Hashing Visualization

Interactive web-based visualization for the research paper **"Optimal Bounds for Open Addressing Without Reordering"** by Farach-Colton, Krapivin, and Kuszmaul.

This project demonstrates the groundbreaking algorithms that disprove Yao's 1985 conjecture and achieve better performance bounds than traditional uniform hashing.

## 🎯 Features

- **Problem Overview**: Comprehensive explanation of open addressing and key concepts (δ, probe complexity)
- **Implementation Overview**: Detailed breakdown of how each algorithm works with motivated examples
- **Algorithm Comparison**: Side-by-side comparison of three hashing approaches
- **Interactive Demo**: Live hash table visualization with animations showing probe sequences
- **Complexity Analysis**: Performance charts comparing theoretical vs empirical results

## 🧮 Algorithms Demonstrated

### 1. Uniform Probing (Linear Probing)
- **Traditional approach** with simple linear probing
- **Complexity**: Θ(log(1/δ)) amortized, Θ(1/δ) worst-case
- **Problem**: Suffers from clustering at high load factors

### 2. Elastic Hashing ⭐
- **Novel algorithm** with layered probing approach
- **Complexity**: O(1) amortized, O(log(1/δ)) worst-case
- **Innovation**: Multi-layered geometric progression avoids clustering

### 3. Funnel Hashing ⭐
- **Advanced algorithm** with funnel-shaped probe distribution
- **Complexity**: O(log²(1/δ)) worst-case guarantee
- **Advantage**: Best worst-case performance for safety-critical applications

## 🚀 Live Demo

Visit the live application: [Coming Soon - Deploy to Vercel]

## 🛠️ Technology Stack

- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Performance visualization
- **D3.js** - Interactive data visualization
- **Webpack 5** - Module bundling

## 📦 Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd optimal-hashing-visualization

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 Usage

1. **Problem Overview**: Start here to understand the background and key concepts
2. **Implementation Overview**: Learn how each algorithm works with step-by-step examples
3. **Algorithm Comparison**: See side-by-side performance comparisons
4. **Interactive Demo**: Experiment with live hash table animations
5. **Complexity Analysis**: Analyze theoretical vs empirical performance

## 📊 Key Educational Features

- **Visual Hash Tables**: Watch algorithms probe through hash table positions
- **Animated Insertions**: See the difference between probing and insertion phases
- **Performance Statistics**: Real-time tracking of probe counts and efficiency
- **Load Factor Control**: Experiment with different table densities
- **Complexity Visualization**: Charts showing how performance scales with δ

## 🔬 Research Impact

This visualization brings to life the groundbreaking research that:
- **Disproves Yao's 1985 conjecture** that uniform hashing is optimal
- **Introduces Elastic Hashing** with constant amortized time
- **Presents Funnel Hashing** with superior worst-case guarantees
- **Opens new avenues** for hash table design in computer science

## 🎯 Educational Goals

Perfect for:
- **Computer Science Students** learning about hash tables and algorithms
- **Researchers** studying open addressing techniques
- **Educators** teaching advanced data structures
- **Developers** implementing high-performance hash tables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📄 License

MIT License - see LICENSE file for details

## 📚 References

Farach-Colton, M., Krapivin, A., & Kuszmaul, W. "Optimal Bounds for Open Addressing Without Reordering"

---

**Made with ❤️ for Computer Science Education** 