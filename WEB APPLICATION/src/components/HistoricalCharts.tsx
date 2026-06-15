import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Thermometer, Droplets, Gauge, CloudRain, TrendingUp, BarChart3 } from 'lucide-react';
import { HistoricalDataPoint } from '../types';

interface HistoricalChartsProps {
  data: HistoricalDataPoint[];
}

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  data: HistoricalDataPoint[];
  dataKey: keyof HistoricalDataPoint;
  color: string;
  gradientColor: string;
  unit: string;
}

function ChartCard({ title, icon, data, dataKey, color, gradientColor, unit }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`${dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 10 }}
              tickLine={false}
              stroke="#9ca3af"
            />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${dataKey}Gradient)`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function HistoricalCharts({ data }: HistoricalChartsProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <p className="text-center text-gray-500">No historical data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Historical Data Visualization
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last {data.length} records
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Temperature"
          icon={<Thermometer className="w-5 h-5 text-red-500" />}
          data={data}
          dataKey="temperature"
          color="#ef4444"
          gradientColor="#ef4444"
          unit="°C"
        />
        <ChartCard
          title="Humidity"
          icon={<Droplets className="w-5 h-5 text-blue-500" />}
          data={data}
          dataKey="humidity"
          color="#3b82f6"
          gradientColor="#3b82f6"
          unit="%"
        />
        <ChartCard
          title="Soil Moisture"
          icon={<Gauge className="w-5 h-5 text-orange-500" />}
          data={data}
          dataKey="soilMoisture"
          color="#f97316"
          gradientColor="#f97316"
          unit="%"
        />
        <ChartCard
          title="Rain Probability"
          icon={<CloudRain className="w-5 h-5 text-cyan-500" />}
          data={data}
          dataKey="rainProbability"
          color="#06b6d4"
          gradientColor="#06b6d4"
          unit="%"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Predicted Yield Over Time
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  stroke="#9ca3af"
                />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Yield']}
                />
                <Line
                  type="monotone"
                  dataKey="yield"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
