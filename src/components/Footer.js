import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Research Paper</h3>
            <p className="text-gray-300 text-sm mb-2">
              "Optimal Bounds for Open Addressing Without Reordering"
            </p>
            <p className="text-gray-400 text-sm">
              by Martin Farach-Colton, Pavel Krapivin, and William Kuszmaul
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Contributions</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Disproved Yao's 1985 conjecture</li>
              <li>• Introduced Elastic Hashing (O(1) amortized)</li>
              <li>• Developed Funnel Hashing (O(log²(1/δ)) worst-case)</li>
              <li>• Maintained no-reordering constraint</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About This Visualization</h3>
            <p className="text-gray-300 text-sm mb-2">
              An interactive educational tool designed to help computer science students 
              and researchers understand the breakthrough algorithms in hash table design.
            </p>
            <p className="text-gray-400 text-sm">
              Built with React, Tailwind CSS, and Chart.js
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            Educational Visualization • Computer Science Research • Hash Table Algorithms
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 