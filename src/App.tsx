import React, { useState } from 'react';
import { TemperatureSlider } from './components/TemperatureSlider';
import { ResultDisplay } from './components/ResultDisplay';
import { calculateMixedTemperature } from './utils/temperature';
import { Droplets } from 'lucide-react';

function App() {
  const [totalVolume, setTotalVolume] = useState(100);
  const [leftPercentage, setLeftPercentage] = useState(0);
  const [rightPercentage, setRightPercentage] = useState(100);
  const [leftTemperature, setLeftTemperature] = useState(21);
  const [rightTemperature, setRightTemperature] = useState(100);

  const handleLeftPercentageChange = (value: number) => {
    setLeftPercentage(value);
    setRightPercentage(100 - value);
  };

  const handleRightPercentageChange = (value: number) => {
    setRightPercentage(value);
    setLeftPercentage(100 - value);
  };

  const resultTemperature = calculateMixedTemperature(
    (leftPercentage / 100) * totalVolume,
    leftTemperature,
    (rightPercentage / 100) * totalVolume,
    rightTemperature
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden">
      <header className="flex-none p-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-800">Water Mixture Calculator</h1>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="totalVolume" className="text-sm font-medium text-gray-600">
            Total Volume (ml):
          </label>
          <input
            id="totalVolume"
            type="number"
            value={totalVolume}
            onChange={(e) => setTotalVolume(Math.max(0, Number(e.target.value)))}
            className="w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </header>

      <main className="flex-1 flex items-stretch overflow-hidden">
        <div className="flex items-stretch justify-between w-full px-4">
          <TemperatureSlider
            percentage={leftPercentage}
            temperature={leftTemperature}
            totalVolume={totalVolume}
            onPercentageChange={handleLeftPercentageChange}
            onTemperatureChange={setLeftTemperature}
            side="left"
          />
          
          <ResultDisplay temperature={resultTemperature} />
          
          <TemperatureSlider
            percentage={rightPercentage}
            temperature={rightTemperature}
            totalVolume={totalVolume}
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