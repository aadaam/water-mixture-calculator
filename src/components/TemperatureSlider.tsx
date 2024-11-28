import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TemperatureSliderProps {
  percentage: number;
  temperature: number;
  totalVolume: number;
  onPercentageChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
  side: 'left' | 'right';
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  percentage,
  temperature,
  totalVolume,
  onPercentageChange,
  onTemperatureChange,
  side,
}) => {
  const volume = (percentage / 100) * totalVolume;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPercentageChange(Number(e.target.value));
  };

  const adjustTemperature = (increment: number) => {
    const newTemp = Math.max(0, Math.min(100, temperature + increment));
    onTemperatureChange(newTemp);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="flex flex-col items-center gap-1">
        <button
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
          onClick={() => adjustTemperature(1)}
        >
          <ChevronUp className="w-8 h-8" />
        </button>
        <span className="text-3xl font-bold" style={{ color: `rgb(${temperature * 2.55}, 0, ${255 - temperature * 2.55})` }}>
          {temperature}°C
        </span>
        <button
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
          onClick={() => adjustTemperature(-1)}
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-2 flex-1 w-full min-h-0">
        <input
          type="range"
          value={percentage}
          onChange={handleSliderChange}
          className="slider-vertical h-full w-16 touch-none"
          style={{
            writingMode: 'bt-lr',
            WebkitAppearance: 'slider-vertical',
            padding: '0 20px'
          }}
          min="0"
          max="100"
          step="1"
        />
        <div className="text-sm font-medium">
          {volume.toFixed(0)} ml
        </div>
        <div className="text-sm font-medium">
          {percentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};