import { motion } from 'framer-motion';
import {
  Brain,
  Leaf,
  Cloud,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SensorData, WeatherData } from '../types';
import { getYieldCategory } from '../utils/decoders';

interface AIPredictionPanelProps {
  sensorData: SensorData;
  weatherData: WeatherData;
}

const cropEncoding: Record<string, string> = {
  Rice: '0',
  Wheat: '1',
  Tomato: '2',
  Chilli: '3',
};

export function AIPredictionPanel({ sensorData, weatherData }: AIPredictionPanelProps) {
  const yieldCategory = getYieldCategory(sensorData.predictedYield);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-8 right-8 w-28 h-28 bg-purple-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-8 left-8 w-36 h-36 bg-blue-500/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm flex-shrink-0"
          >
            <Brain className="w-7 h-7 text-purple-300" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              AI Prediction Panel
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h2>
            <p className="text-xs text-white/60">TinyML TensorFlow Lite Micro</p>
          </div>
        </div>

        {/* Prediction Cards — single column so nothing is clipped */}
        <div className="grid grid-cols-1 gap-3">

          {/* Crop Type */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                <Leaf className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 uppercase tracking-wide">Crop Type</p>
                <p className="text-base font-semibold truncate">{sensorData.cropType}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-white/50">Encoded</p>
                <p className="text-sm font-mono font-bold text-green-300">
                  {cropEncoding[sensorData.cropType] ?? '?'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Weather Condition */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Cloud className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 uppercase tracking-wide">Weather</p>
                <p className="text-base font-semibold truncate">{weatherData.weatherMain}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-white/50">Rain Prob.</p>
                <p className="text-sm font-mono font-bold text-blue-300">
                  {sensorData.rainProbability}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Predicted Yield */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 uppercase tracking-wide">Predicted Yield</p>
                <p className="text-base font-semibold">{sensorData.predictedYield.toFixed(1)}%</p>
              </div>
              <span
                className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                  yieldCategory === 'High Yield'
                    ? 'bg-green-500/25 text-green-300 border border-green-500/30'
                    : yieldCategory === 'Medium Yield'
                    ? 'bg-yellow-500/25 text-yellow-300 border border-yellow-500/30'
                    : 'bg-red-500/25 text-red-300 border border-red-500/30'
                }`}
              >
                {yieldCategory}
              </span>
            </div>
          </motion.div>

          {/* TinyML Status */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 uppercase tracking-wide">TinyML Status</p>
                <p className="text-base font-semibold">Running</p>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"
              />
            </div>
          </motion.div>
        </div>

        {/* Model Info footer */}
        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-start gap-2 text-xs text-white/50">
            <Target className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Model: TensorFlow Lite Micro | Input: [Temp, Humidity, Soil, Rain Prob]</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
