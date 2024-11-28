export const calculateMixedTemperature = (
  volume1: number,
  temp1: number,
  volume2: number,
  temp2: number
): number => {
  const totalVolume = volume1 + volume2;
  if (totalVolume === 0) return 0;
  
  return (volume1 * temp1 + volume2 * temp2) / totalVolume;
};

export const getTemperatureColor = (temperature: number): string => {
  const normalizedTemp = Math.max(0, Math.min(100, temperature)) / 100;
  const red = Math.round(255 * normalizedTemp);
  const blue = Math.round(255 * (1 - normalizedTemp));
  return `rgb(${red}, 0, ${blue})`;
};