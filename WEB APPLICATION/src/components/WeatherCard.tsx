import { motion } from 'framer-motion';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudFog,
  CloudSun,
  Wind,
  Droplets,
  MapPin,
} from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

const weatherIcons: Record<string, React.ReactNode> = {
  Sunny: <Sun className="w-16 h-16 text-yellow-400" />,
  Cloudy: <Cloud className="w-16 h-16 text-gray-400" />,
  'Partly Cloudy': <CloudSun className="w-16 h-16 text-yellow-400" />,
  Rainy: <CloudRain className="w-16 h-16 text-blue-400" />,
  Foggy: <CloudFog className="w-16 h-16 text-gray-300" />,
};

const weatherGradients: Record<string, string> = {
  Sunny: 'from-yellow-400 to-orange-400',
  Cloudy: 'from-gray-400 to-gray-500',
  'Partly Cloudy': 'from-yellow-300 to-blue-400',
  Rainy: 'from-blue-400 to-blue-600',
  Foggy: 'from-gray-300 to-gray-400',
};

export function WeatherCard({ weather }: WeatherCardProps) {
  const Icon = weatherIcons[weather.weatherMain] || <Cloud className="w-16 h-16" />;
  const gradient = weatherGradients[weather.weatherMain] || 'from-gray-400 to-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`}
    >
      <div className="absolute top-0 right-0 opacity-20">
        {Icon}
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Current Weather</p>
            <h2 className="text-4xl font-bold mt-1">{Math.round(weather.temperature)}°C</h2>
            <p className="text-lg font-medium mt-1 capitalize">{weather.weatherDescription}</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {Icon}
          </motion.div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{weather.location}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center bg-white/20 rounded-xl p-3 backdrop-blur-sm"
          >
            <Droplets className="w-5 h-5 mb-1" />
            <span className="text-xs opacity-80">Humidity</span>
            <span className="text-lg font-semibold">{weather.humidity}%</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center bg-white/20 rounded-xl p-3 backdrop-blur-sm"
          >
            <CloudRain className="w-5 h-5 mb-1" />
            <span className="text-xs opacity-80">Rain</span>
            <span className="text-lg font-semibold">{weather.rainProbability}%</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center bg-white/20 rounded-xl p-3 backdrop-blur-sm"
          >
            <Wind className="w-5 h-5 mb-1" />
            <span className="text-xs opacity-80">Wind</span>
            <span className="text-lg font-semibold">{Math.round(weather.windSpeed)} m/s</span>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
