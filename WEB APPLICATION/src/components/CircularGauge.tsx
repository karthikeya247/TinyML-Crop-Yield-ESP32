import { motion } from 'framer-motion';

interface CircularGaugeProps {
  value: number;
  min: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularGauge({
  value,
  min,
  max,
  color,
  size = 120,
  strokeWidth = 10,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  const getColorClass = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      'text-red-500': '#ef4444',
      'text-orange-500': '#f97316',
      'text-yellow-500': '#eab308',
      'text-green-500': '#22c55e',
      'text-blue-500': '#3b82f6',
      'text-purple-500': '#a855f7',
      'text-cyan-500': '#06b6d4',
      'text-emerald-500': '#10b981',
    };
    return colorMap[colorClass] || '#22c55e';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColorClass(color)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
