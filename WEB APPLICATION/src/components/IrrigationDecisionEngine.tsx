import { motion } from 'framer-motion';
import {
  Droplets,
  Gauge,
  CloudRain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { SensorData } from '../types';
import { getMoistureStatus, getMoistureStatusColor } from '../utils/decoders';

interface IrrigationDecisionEngineProps {
  data: SensorData;
}

export function IrrigationDecisionEngine({ data }: IrrigationDecisionEngineProps) {
  const moistureStatus = getMoistureStatus(data.soilMoisture);
  const moistureColor = getMoistureStatusColor(data.soilMoisture);

  const shouldIrrigate = data.irrigationDecision;

  const getDecisionReason = () => {
    if (data.soilMoisture < 40) return 'Soil is dry';
    if (data.rainProbability < 30) return 'Low rain chance';
    if (data.soilMoisture < 50 && data.rainProbability < 50) return 'Moderate conditions';
    return 'Adequate moisture';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-6">
        <Droplets className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Irrigation Decision Engine
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Soil Moisture */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Gauge className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Soil Moisture</p>
              <p className={`text-2xl font-bold ${moistureColor}`}>
                {data.soilMoisture.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                moistureStatus === 'Dry'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : moistureStatus === 'Moderate'
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              }`}
            >
              {moistureStatus}
            </span>
          </div>
        </motion.div>

        {/* Rain Probability */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CloudRain className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rain Probability</p>
              <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                {data.rainProbability.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {data.rainProbability > 70
                ? 'High'
                : data.rainProbability > 30
                ? 'Moderate'
                : 'Low'}
            </span>
          </div>
        </motion.div>

        {/* Pump Status */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                data.pumpStatus
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              <Zap
                className={`w-5 h-5 ${data.pumpStatus ? 'text-green-500' : 'text-red-500'}`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pump Status</p>
              <p
                className={`text-2xl font-bold ${
                  data.pumpStatus ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {data.pumpStatus ? 'ON' : 'OFF'}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <motion.div
              animate={{ scale: data.pumpStatus ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: data.pumpStatus ? Infinity : 0 }}
              className={`w-3 h-3 rounded-full mx-auto ${
                data.pumpStatus ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </div>
        </motion.div>
      </div>

      {/* Decision Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl ${
          shouldIrrigate
            ? 'bg-gradient-to-r from-red-500 to-orange-500'
            : 'bg-gradient-to-r from-green-500 to-emerald-500'
        } text-white`}
      >
        <div className="flex items-start gap-4">
          {shouldIrrigate ? (
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-8 h-8 flex-shrink-0" />
          )}
          <div>
            <h3 className="text-xl font-bold">
              {shouldIrrigate ? 'Irrigation Required' : 'No Irrigation Required'}
            </h3>
            <p className="text-white/90 mt-1">{getDecisionReason()}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                <Info className="w-4 h-4" />
                Soil: {data.soilMoisture.toFixed(0)}%
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                <CloudRain className="w-4 h-4" />
                Rain: {data.rainProbability.toFixed(0)}%
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                <Zap className="w-4 h-4" />
                Pump: {data.pumpStatus ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
