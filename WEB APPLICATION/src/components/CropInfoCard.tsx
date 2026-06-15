import { motion } from 'framer-motion';
import {
  Leaf,
  TrendingUp,
  Droplets,
  Zap,
  Target,
} from 'lucide-react';
import { SensorData } from '../types';
import { getYieldCategory, getYieldCategoryColor } from '../utils/decoders';

interface CropInfoCardProps {
  data: SensorData;
}

interface CardConfig {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  status?: boolean;
}

export function CropInfoCard({ data }: CropInfoCardProps) {
  const yieldCategory = getYieldCategory(data.predictedYield);
  const yieldColor = getYieldCategoryColor(data.predictedYield);

  const cards: CardConfig[] = [
    {
      title: 'Selected Crop',
      value: data.cropType,
      icon: <Leaf className="w-7 h-7 text-white" />,
      gradient: 'from-green-500 to-green-700',
      iconBg: 'bg-green-400/40',
    },
    {
      title: 'Predicted Yield',
      value: `${data.predictedYield.toFixed(1)}%`,
      subtitle: yieldCategory,
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      gradient: 'from-blue-500 to-blue-700',
      iconBg: 'bg-blue-400/40',
    },
    {
      title: 'Pump Status',
      value: data.pumpStatus ? 'ON' : 'OFF',
      icon: <Zap className="w-7 h-7 text-white" />,
      gradient: data.pumpStatus ? 'from-emerald-500 to-emerald-700' : 'from-red-500 to-red-700',
      iconBg: data.pumpStatus ? 'bg-emerald-400/40' : 'bg-red-400/40',
      status: data.pumpStatus,
    },
    {
      title: 'Irrigation Status',
      value: data.irrigationDecision ? 'Required' : 'Not Required',
      icon: <Droplets className="w-7 h-7 text-white" />,
      gradient: data.irrigationDecision ? 'from-orange-500 to-orange-700' : 'from-teal-500 to-teal-700',
      iconBg: data.irrigationDecision ? 'bg-orange-400/40' : 'bg-teal-400/40',
      status: data.irrigationDecision,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Current Crop Information
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className={`relative bg-gradient-to-b ${card.gradient} rounded-2xl shadow-lg overflow-hidden`}
          >
            {/* Window title bar dots */}
            <div className="flex items-center gap-1.5 px-3 pt-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
            </div>

            {/* Card body */}
            <div className="flex flex-col items-center text-center px-4 py-4 gap-3">
              <div className={`${card.iconBg} p-3 rounded-xl`}>
                {card.icon}
              </div>

              <p className="text-xs font-semibold text-white/80 uppercase tracking-wider leading-tight">
                {card.title}
              </p>

              <p className={`text-2xl font-extrabold text-white leading-none break-words w-full ${card.subtitle ? card.subtitle === 'High Yield' ? 'text-green-200' : card.subtitle === 'Medium Yield' ? 'text-yellow-200' : 'text-red-200' : ''}`}>
                {card.value}
              </p>

              {card.subtitle ? (
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                  {card.subtitle}
                </span>
              ) : card.status !== undefined ? (
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{
                      opacity: card.status ? [1, 0.3, 1] : 1,
                      scale: card.status ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 1.5, repeat: card.status ? Infinity : 0 }}
                    className={`w-2.5 h-2.5 rounded-full ${card.status ? 'bg-white' : 'bg-white/40'}`}
                  />
                  <span className="text-xs text-white/80">
                    {card.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
