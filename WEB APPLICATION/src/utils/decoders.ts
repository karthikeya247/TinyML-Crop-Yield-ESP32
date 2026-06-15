// Crop Encoding Map
export const cropMap: Record<number, string> = {
  0: 'Rice',
  1: 'Wheat',
  2: 'Tomato',
  3: 'Chilli',
};

// Weather Encoding Map
export const weatherMap: Record<number, string> = {
  0: 'Cloudy',
  1: 'Foggy',
  2: 'Partly Cloudy',
  3: 'Rainy',
  4: 'Sunny',
};

// Decode Crop from Field5
export function decodeCrop(encoded: number | string): string {
  const value = typeof encoded === 'string' ? parseInt(encoded, 10) : encoded;
  return cropMap[value] ?? 'Unknown';
}

// Decode Weather from encoded value
export function decodeWeather(encoded: number | string): string {
  const value = typeof encoded === 'string' ? parseInt(encoded, 10) : encoded;
  return weatherMap[value] ?? 'Unknown';
}

// Map OpenWeather API weather to our weather types
export function mapOpenWeatherWeather(apiWeather: string): string {
  const weather = apiWeather.toLowerCase();

  if (weather === 'clear') return 'Sunny';
  if (weather === 'clouds') return 'Cloudy';
  if (weather === 'rain') return 'Rainy';
  if (weather === 'drizzle') return 'Rainy';
  if (weather === 'thunderstorm') return 'Rainy';
  if (weather === 'mist') return 'Foggy';
  if (weather === 'fog') return 'Foggy';
  if (weather === 'haze') return 'Foggy';
  if (weather === 'smoke') return 'Foggy';

  return 'Cloudy';
}

// Decode Pump Status (0 = OFF, 1 = ON)
export function decodePumpStatus(status: number | string): boolean {
  const value = typeof status === 'string' ? parseInt(status, 10) : status;
  return value === 1;
}

// Decode Irrigation Decision (0 = No Irrigation Required, 1 = Irrigation Required)
export function decodeIrrigationDecision(decision: number | string): boolean {
  const value = typeof decision === 'string' ? parseInt(decision, 10) : decision;
  return value === 1;
}

// Get Soil Moisture Status
export function getMoistureStatus(value: number): string {
  if (value < 40) return 'Dry';
  if (value < 70) return 'Moderate';
  return 'Wet';
}

// Get Yield Category
export function getYieldCategory(yieldValue: number): string {
  if (yieldValue < 40) return 'Low Yield';
  if (yieldValue < 80) return 'Medium Yield';
  return 'High Yield';
}

// Get Yield Category Color
export function getYieldCategoryColor(yieldValue: number): string {
  if (yieldValue < 40) return 'text-red-500';
  if (yieldValue < 80) return 'text-yellow-500';
  return 'text-green-500';
}

// Get Weather Icon Name
export function getWeatherIcon(weather: string): string {
  const iconMap: Record<string, string> = {
    Sunny: 'Sun',
    Cloudy: 'Cloud',
    'Partly Cloudy': 'CloudSun',
    Rainy: 'CloudRain',
    Foggy: 'CloudFog',
  };
  return iconMap[weather] || 'Cloud';
}

// Get Moisture Status Color
export function getMoistureStatusColor(value: number): string {
  if (value < 40) return 'text-red-500';
  if (value < 70) return 'text-yellow-500';
  return 'text-green-500';
}

// Get Moisture Status Background Color
export function getMoistureStatusBgColor(value: number): string {
  if (value < 40) return 'bg-red-100 dark:bg-red-900/30';
  if (value < 70) return 'bg-yellow-100 dark:bg-yellow-900/30';
  return 'bg-green-100 dark:bg-green-900/30';
}
