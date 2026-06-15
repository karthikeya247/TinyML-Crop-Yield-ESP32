import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl animate-pulse" />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Weather Card Skeleton */}
            <div className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />

            {/* Sensor Gauges Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* AI Panel Skeleton */}
            <div className="h-64 bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl animate-pulse" />

            {/* Info Card Skeleton */}
            <div className="h-48 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="px-6 py-3 bg-primary-500 text-white rounded-full shadow-lg flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
          <span>Loading sensor data...</span>
        </motion.div>
      </div>
    </div>
  );
}
