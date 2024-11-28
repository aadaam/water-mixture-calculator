import React from 'react';
import { getTemperatureColor } from '../utils/temperature';

interface ResultDisplayProps {
  temperature: number;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ temperature }) => {
  return (
    <div className="flex flex-col items-center justify-center px-2">
      <h2 className="text-sm font-medium text-gray-600 mb-1">Result</h2>
      <div className="text-3xl font-bold" style={{ color: getTemperatureColor(temperature) }}>
        {temperature.toFixed(1)}°C
      </div>
    </div>
  );
};