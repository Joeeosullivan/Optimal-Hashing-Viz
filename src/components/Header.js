import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-hash-primary to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Optimal Bounds for Open Addressing
            <span className="block text-2xl md:text-3xl font-medium mt-2 text-blue-100">
              Without Reordering
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-4">
            Interactive Visualization of Elastic & Funnel Hashing
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100">
            <span className="bg-blue-800 bg-opacity-50 px-3 py-1 rounded-full">
              Farach-Colton, Krapivin & Kuszmaul
            </span>
            <span className="bg-blue-800 bg-opacity-50 px-3 py-1 rounded-full">
              Computer Science Research
            </span>
            <span className="bg-blue-800 bg-opacity-50 px-3 py-1 rounded-full">
              Hash Table Algorithms
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 