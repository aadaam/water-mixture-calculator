import React, { useState, useRef, useEffect } from 'react';
import { TemperatureSlider } from './components/TemperatureSlider';
import { ResultDisplay } from './components/ResultDisplay';
import { calculateMixedTemperature } from './utils/temperature';
import { Droplets } from 'lucide-react';

function App() {
  // Change totalVolume state from number to string
  const [totalVolume, setTotalVolume] = useState('100');
  const [leftPercentage, setLeftPercentage] = useState(0);
  const [rightPercentage, setRightPercentage] = useState(100);
  
  // Initialize leftTemperature from localStorage or default to 21
  const [leftTemperature, setLeftTemperature] = useState(() => {
    const storedTemp = localStorage.getItem('leftTemperature');
    return storedTemp ? Number(storedTemp) : 21;
  });
  
  const [rightTemperature, setRightTemperature] = useState(100);

  // State to manage previous totalVolume values
  const [previousVolumes, setPreviousVolumes] = useState<string[]>([]);

  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ref for dropdown to handle outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load previousVolumes from localStorage on component mount
  useEffect(() => {
    try {
      const storedVolumes = localStorage.getItem('previousVolumes');
      if (storedVolumes) {
        const parsedVolumes = JSON.parse(storedVolumes);
        if (Array.isArray(parsedVolumes)) {
          setPreviousVolumes(parsedVolumes);
        }
      }
    } catch (error) {
      console.error('Failed to load previousVolumes from localStorage:', error);
    }
  }, []);

  // Save previousVolumes to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('previousVolumes', JSON.stringify(previousVolumes));
    } catch (error) {
      console.error('Failed to save previousVolumes to localStorage:', error);
    }
  }, [previousVolumes]);

  // Save leftTemperature to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('leftTemperature', leftTemperature.toString());
    } catch (error) {
      console.error('Failed to save leftTemperature to localStorage:', error);
    }
  }, [leftTemperature]);

  const handleLeftPercentageChange = (value: number) => {
    setLeftPercentage(value);
    setRightPercentage(100 - value);
  };

  const handleRightPercentageChange = (value: number) => {
    setRightPercentage(value);
    setLeftPercentage(100 - value);
  };

  // Parse totalVolume to a number, defaulting to 1 if invalid
  const numericTotalVolume = Math.max(1, Number(totalVolume) || 1);

  const resultTemperature = calculateMixedTemperature(
    (leftPercentage / 100) * numericTotalVolume,
    leftTemperature,
    (rightPercentage / 100) * numericTotalVolume,
    rightTemperature
  );

  // Handler to update totalVolume and manage previousVolumes
  const handleTotalVolumeChange = (value: string) => {
    setTotalVolume(value);
  };

  const handleTotalVolumeBlur = () => {
    const numericValue = Number(totalVolume);
    if (!isNaN(numericValue) && numericValue >= 1) {
      // Avoid duplicate entries
      setPreviousVolumes((prev) => {
        if (!prev.includes(totalVolume)) {
          return [totalVolume, ...prev].slice(0, 5); // Keep last 5 entries
        }
        return prev;
      });
    } else {
      // Reset to minimum if invalid
      setTotalVolume('1');
    }
  };

  // Handler to select a previous volume
  const selectPreviousVolume = (value: string) => {
    setTotalVolume(value);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden">
      <header className="flex-none p-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Droplets className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Water Mixture Calculator
          </h1>
        </div>

        <div className="flex items-center justify-center gap-2 relative" ref={dropdownRef}>
          <label htmlFor="totalVolume" className="text-sm font-medium text-gray-600">
            Total Volume (ml):
          </label>
          <div className="relative">
            <input
              id="totalVolume"
              type="number"
              min="1"
              value={totalVolume}
              onChange={(e) => handleTotalVolumeChange(e.target.value)}
              onBlur={handleTotalVolumeBlur}
              className="w-24 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-base"
              style={{ fontSize: '16px' }}
            />
            {/* Button to toggle dropdown */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="absolute right-0 top-0 mt-1 mr-1 text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label="Open previous values"
              tabIndex={-1} // Prevent tab focus
            >
              📂
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && previousVolumes.length > 0 && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                <ul className="max-h-40 overflow-y-auto">
                  {previousVolumes.map((volume, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => selectPreviousVolume(volume)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      >
                        {volume} ml
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {isDropdownOpen && previousVolumes.length === 0 && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                <p className="px-3 py-2 text-gray-500">No previous volumes.</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-stretch overflow-hidden">
        <div className="flex items-stretch justify-between w-full px-4">
          <TemperatureSlider
            percentage={leftPercentage}
            temperature={leftTemperature}
            // Pass the parsed numericTotalVolume
            totalVolume={numericTotalVolume}
            onPercentageChange={handleLeftPercentageChange}
            onTemperatureChange={setLeftTemperature}
            side="left"
          />

          <ResultDisplay temperature={resultTemperature} />

          <TemperatureSlider
            percentage={rightPercentage}
            temperature={rightTemperature}
            // Pass the parsed numericTotalVolume
            totalVolume={numericTotalVolume}
            onPercentageChange={handleRightPercentageChange}
            onTemperatureChange={setRightTemperature}
            side="right"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
