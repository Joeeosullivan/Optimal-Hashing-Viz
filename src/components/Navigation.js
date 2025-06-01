import React from 'react';

const Navigation = ({ currentSection, setCurrentSection, sections }) => {
  const navItems = [
    { key: sections.PROBLEM, label: 'Problem Overview', icon: '📚' },
    { key: sections.IMPLEMENTATION, label: 'Implementation Overview', icon: '🔧' },
    { key: sections.COMPARISON, label: 'Algorithm Comparison', icon: '⚖️' },
    { key: sections.DEMO, label: 'Interactive Demo', icon: '🎮' },
    { key: sections.ANALYSIS, label: 'Complexity Analysis', icon: '📊' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentSection(item.key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  currentSection === item.key
                    ? 'bg-hash-primary text-white shadow-md'
                    : 'text-hash-text hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 