import { motion } from 'framer-motion';
import { CircularGauge } from './CircularGauge';

interface SensorGaugeProps {
  title: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  color: string;
  icon: React.ReactNode;
  status?: string;
  statusColor?: string;
}

export function SensorGauge({
  title,
  value,
  unit,
  min = 0,
  max = 100,
  color,
  icon,
  status,
  statusColor,
}: SensorGaugeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <CircularGauge value={value} min={min} max={max} color={color} />
      </div>

      <div className="text-center">
        <p className={`text-3xl font-bold ${color}`}>
          {value.toFixed(1)}
          <span className="text-lg ml-1">{unit}</span>
        </p>
        {status && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {status}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
