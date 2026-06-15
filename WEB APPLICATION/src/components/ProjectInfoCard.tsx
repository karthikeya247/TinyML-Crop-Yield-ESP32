import { motion } from 'framer-motion';
import {
  Cpu,
  Brain,
  Cloud,
  MapPin,
  Wifi,
  Database,
  Server,
  Globe,
} from 'lucide-react';

export function ProjectInfoCard() {
  const infoItems = [
    {
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      iconBg: 'bg-blue-500/20',
      label: 'Controller',
      value: 'ESP32',
    },
    {
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      iconBg: 'bg-purple-500/20',
      label: 'AI Engine',
      value: 'TensorFlow Lite Micro',
    },
    {
      icon: <Database className="w-4 h-4 text-green-400" />,
      iconBg: 'bg-green-500/20',
      label: 'Cloud',
      value: 'ThingSpeak',
    },
    {
      icon: <Cloud className="w-4 h-4 text-cyan-400" />,
      iconBg: 'bg-cyan-500/20',
      label: 'Weather',
      value: 'OpenWeather API',
    },
    {
      icon: <MapPin className="w-4 h-4 text-red-400" />,
      iconBg: 'bg-red-500/20',
      label: 'Location',
      value: 'Tadepalligudem',
    },
    {
      icon: <Globe className="w-4 h-4 text-orange-400" />,
      iconBg: 'bg-orange-500/20',
      label: 'Coordinates',
      value: '16.815°N, 81.526°E',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">
          <Server className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Project Information</h2>
          <p className="text-xs text-gray-400">Technical Specifications</p>
        </div>
      </div>

      {/* Project Title Box */}
      <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Project Title</p>
        <p className="text-sm font-medium leading-relaxed text-white">
          Edge AI Smart Crop Yield Prediction and Automated Irrigation System
        </p>
      </div>

      {/* Info Grid — 2 columns max so text never clips */}
      <div className="grid grid-cols-2 gap-2.5">
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="flex items-start gap-2.5 p-3 bg-white/5 rounded-xl border border-white/10"
          >
            <div className={`${item.iconBg} p-1.5 rounded-lg flex-shrink-0 mt-0.5`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 leading-none mb-1">{item.label}</p>
              <p className="text-xs font-semibold text-white leading-snug break-words">
                {item.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <Wifi className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Real-time data sync via WiFi</span>
      </div>
    </motion.div>
  );
}
