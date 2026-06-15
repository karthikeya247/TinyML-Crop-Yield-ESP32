import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Thermometer,
  Droplets,
  Gauge,
  Target,
  BarChart3,
} from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsPanelProps {
  analytics: AnalyticsData;
}

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  delay?: number;
}

function StatCard({ title, value, unit, icon, color, bgColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className={`${bgColor} rounded-xl p-4 shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {value.toFixed(1)}
            <span className="text-sm ml-1">{unit}</span>
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-white/50 dark:bg-gray-800/50`}>{icon}</div>
      </div>
    </motion.div>
  );
}

export function AnalyticsPanel({ analytics }: AnalyticsPanelProps) {
  const stats = [
    {
      title: 'Avg Temperature',
      value: analytics.avgTemperature,
      unit: '°C',
      icon: <Thermometer className="w-5 h-5 text-red-500" />,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Avg Humidity',
      value: analytics.avgHumidity,
      unit: '%',
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Avg Soil Moisture',
      value: analytics.avgSoilMoisture,
      unit: '%',
      icon: <Gauge className="w-5 h-5 text-orange-500" />,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Avg Yield',
      value: analytics.avgYield,
      unit: '%',
      icon: <Target className="w-5 h-5 text-purple-500" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Analytics Overview
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Maximum Yield</p>
              <p className="text-2xl font-bold">{analytics.maxYield.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Minimum Yield</p>
              <p className="text-2xl font-bold">{analytics.minYield.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Total Records</p>
              <p className="text-2xl font-bold">{analytics.totalRecords}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
