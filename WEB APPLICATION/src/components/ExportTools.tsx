import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Download, Image, RefreshCw, FileText } from 'lucide-react';
import { HistoricalDataPoint, SensorData, AnalyticsData } from '../types';

interface ExportToolsProps {
  historicalData: HistoricalDataPoint[];
  sensorData: SensorData | null;
  analytics: AnalyticsData | null;
  onRefresh: () => void;
}

export function ExportTools({ historicalData, sensorData, analytics, onRefresh }: ExportToolsProps) {
  const exportToCSV = () => {
    if (historicalData.length === 0) return;

    const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Soil Moisture (%)', 'Rain Probability (%)', 'Yield (%)'];
    const csvContent = [
      headers.join(','),
      ...historicalData.map(row =>
        `${row.timestamp},${row.temperature.toFixed(2)},${row.humidity.toFixed(2)},${row.soilMoisture.toFixed(2)},${row.rainProbability.toFixed(2)},${row.yield.toFixed(2)}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `crop_yield_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportChartsAsPNG = async () => {
    const chartsContainer = document.getElementById('charts-container');
    if (!chartsContainer) return;

    try {
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(chartsContainer, {
        backgroundColor: '#ffffff',
        quality: 1,
      });

      const link = document.createElement('a');
      link.download = `crop_yield_charts_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export charts:', error);
    }
  };

  const exportSummary = () => {
    if (!sensorData || !analytics) return;

    const summary = `
=== Crop Yield Prediction System Summary ===
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

CURRENT SENSOR DATA
-------------------
Crop Type: ${sensorData.cropType}
Temperature: ${sensorData.temperature.toFixed(2)}°C
Humidity: ${sensorData.humidity.toFixed(2)}%
Soil Moisture: ${sensorData.soilMoisture.toFixed(2)}%
Rain Probability: ${sensorData.rainProbability.toFixed(2)}%
Predicted Yield: ${sensorData.predictedYield.toFixed(2)}%
Pump Status: ${sensorData.pumpStatus ? 'ON' : 'OFF'}
Irrigation Decision: ${sensorData.irrigationDecision ? 'Required' : 'Not Required'}

ANALYTICS SUMMARY
-----------------
Average Temperature: ${analytics.avgTemperature.toFixed(2)}°C
Average Humidity: ${analytics.avgHumidity.toFixed(2)}%
Average Soil Moisture: ${analytics.avgSoilMoisture.toFixed(2)}%
Average Yield: ${analytics.avgYield.toFixed(2)}%
Maximum Yield: ${analytics.maxYield.toFixed(2)}%
Minimum Yield: ${analytics.minYield.toFixed(2)}%
Total Records: ${analytics.totalRecords}

Location: Tadepalligudem, Andhra Pradesh, India
Coordinates: 16.815°N, 81.526°E
    `.trim();

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `crop_yield_summary_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary-500" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Export Tools
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToCSV}
          className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <FileText className="w-6 h-6 text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">Download CSV</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Historical Data</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportChartsAsPNG}
          className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Image className="w-6 h-6 text-blue-500" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Export Charts</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">PNG Format</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportSummary}
          className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        >
          <Download className="w-6 h-6 text-purple-500" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Export Summary</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Text Report</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRefresh}
          className="flex flex-col items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
        >
          <RefreshCw className="w-6 h-6 text-orange-500" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Refresh Data</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Manual Update</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
