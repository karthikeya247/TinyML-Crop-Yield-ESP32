import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorToastProps {
  error: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorToast({ error, onDismiss, onRetry }: ErrorToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50 max-w-md"
      >
        <div className="bg-red-50 dark:bg-red-900/90 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Connection Error
              </p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">{error}</p>
            </div>
            <div className="flex items-center gap-2">
              {onRetry && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRetry}
                  className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDismiss}
                className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
