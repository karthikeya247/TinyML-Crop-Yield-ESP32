import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Cloud,
  Wifi,
  WifiOff,
  Activity,
  MapPin,
  Clock,
  Leaf,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  isDark: boolean;
  toggleDark: () => void;
  onRefresh: () => void;
}

export function Header({ lastUpdated, isDark, toggleDark, onRefresh }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 dark:from-primary-800 dark:via-primary-700 dark:to-accent-700 text-white shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
                Edge AI Smart Crop Yield Prediction
              </h1>
              <p className="text-sm text-white/80">
                ESP32 + TinyML + IoT Automated Irrigation System
              </p>
            </div>
          </motion.div>

          {/* Date and Time */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="hidden md:block text-white/90">{formatDate(currentTime)}</div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* Location */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm text-sm">
              <MapPin className="w-4 h-4" />
              <span>Tadepalligudem, AP</span>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm text-sm">
              <Activity className="w-4 h-4 text-green-300 animate-pulse" />
              <span>System Active</span>
            </div>

            {/* Cloud Status */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm text-sm">
              <Cloud className="w-4 h-4" />
              <span>WiFi</span>
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDark}
              className="p-2 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </motion.div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center text-xs text-white/70"
          >
            Last updated: {formatTime(lastUpdated)} | Auto-refresh every 30s
          </motion.div>
        )}
      </div>
    </header>
  );
}
