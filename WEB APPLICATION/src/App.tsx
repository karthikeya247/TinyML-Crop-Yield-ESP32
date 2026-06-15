import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Gauge,
  CloudRain,
} from 'lucide-react';
import { Header } from './components/Header';
import { WeatherCard } from './components/WeatherCard';
import { CropInfoCard } from './components/CropInfoCard';
import { SensorGauge } from './components/SensorGauge';
import { AIPredictionPanel } from './components/AIPredictionPanel';
import { IrrigationDecisionEngine } from './components/IrrigationDecisionEngine';
import { HistoricalCharts } from './components/HistoricalCharts';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ExportTools } from './components/ExportTools';
import { ProjectInfoCard } from './components/ProjectInfoCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorToast } from './components/ErrorToast';
import { useDashboardData } from './hooks/useDashboardData';
import { getMoistureStatus, getMoistureStatusColor } from './utils/decoders';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [showError, setShowError] = useState(true);

  const {
    sensorData,
    weatherData,
    historicalData,
    analytics,
    isLoading,
    error,
    lastUpdated,
    refetch,
  } = useDashboardData();

  // Initialize dark mode from system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  // Show loading skeleton while data is being fetched
  if (isLoading && !sensorData) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Error Toast */}
      <AnimatePresence>
        {error && showError && (
          <ErrorToast
            error={error}
            onDismiss={() => setShowError(false)}
            onRetry={refetch}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        lastUpdated={lastUpdated}
        isDark={isDark}
        toggleDark={toggleDark}
        onRefresh={refetch}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Main Dashboard */}
          <div className="xl:col-span-3 space-y-6">
            {/* Weather + Crop Info Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {weatherData && <WeatherCard weather={weatherData} />}
              {sensorData && <CropInfoCard data={sensorData} />}
            </div>

            {/* Sensor Gauges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Live Sensor Monitoring
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sensorData && (
                  <>
                    <SensorGauge
                      title="Temperature"
                      value={sensorData.temperature}
                      unit="°C"
                      min={0}
                      max={50}
                      color="text-red-500"
                      icon={<Thermometer className="w-6 h-6 text-red-500" />}
                    />
                    <SensorGauge
                      title="Humidity"
                      value={sensorData.humidity}
                      unit="%"
                      min={0}
                      max={100}
                      color="text-blue-500"
                      icon={<Droplets className="w-6 h-6 text-blue-500" />}
                    />
                    <SensorGauge
                      title="Soil Moisture"
                      value={sensorData.soilMoisture}
                      unit="%"
                      min={0}
                      max={100}
                      color="text-orange-500"
                      icon={<Gauge className="w-6 h-6 text-orange-500" />}
                      status={getMoistureStatus(sensorData.soilMoisture)}
                      statusColor={getMoistureStatusColor(sensorData.soilMoisture)}
                    />
                    <SensorGauge
                      title="Rain Probability"
                      value={sensorData.rainProbability}
                      unit="%"
                      min={0}
                      max={100}
                      color="text-cyan-500"
                      icon={<CloudRain className="w-6 h-6 text-cyan-500" />}
                    />
                  </>
                )}
              </div>
            </motion.div>

            {/* Irrigation Decision Engine */}
            {sensorData && <IrrigationDecisionEngine data={sensorData} />}

            {/* Historical Charts */}
            <div id="charts-container">
              <HistoricalCharts data={historicalData} />
            </div>

            {/* Analytics */}
            {analytics && <AnalyticsPanel analytics={analytics} />}

            {/* Export Tools */}
            <ExportTools
              historicalData={historicalData}
              sensorData={sensorData}
              analytics={analytics}
              onRefresh={refetch}
            />
          </div>

          {/* Right Column - Side Panel */}
          <div className="space-y-6">
            {/* AI Prediction Panel */}
            {sensorData && weatherData && (
              <AIPredictionPanel sensorData={sensorData} weatherData={weatherData} />
            )}

            {/* Project Info Card */}
            <ProjectInfoCard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                Edge AI Smart Crop Yield Prediction System
              </p>
              <p className="text-xs mt-1">
                ESP32 + TinyML + ThingSpeak + OpenWeather API
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Auto-refresh: 30s</span>
              <span>|</span>
              <span>Tadepalligudem, AP</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
