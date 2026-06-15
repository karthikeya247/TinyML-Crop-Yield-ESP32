import { useState, useEffect, useCallback } from 'react';
import { ThingSpeakAPI, OpenWeatherAPI } from '../services/api';
import {
  SensorData,
  WeatherData,
  HistoricalDataPoint,
  AnalyticsData,
  ThingSpeakFeed,
  OpenWeatherForecastItem,
} from '../types';
import {
  decodeCrop,
  decodePumpStatus,
  decodeIrrigationDecision,
  mapOpenWeatherWeather,
} from '../utils/decoders';

const REFRESH_INTERVAL = 30000; // 30 seconds

// Parse ThingSpeak feed to SensorData
function parseThingSpeakFeed(feed: ThingSpeakFeed): SensorData {
  return {
    temperature: parseFloat(feed.field1) || 0,
    humidity: parseFloat(feed.field2) || 0,
    soilMoisture: parseFloat(feed.field3) || 0,
    rainProbability: parseFloat(feed.field4) || 0,
    cropType: decodeCrop(feed.field5),
    pumpStatus: decodePumpStatus(feed.field6),
    predictedYield: parseFloat(feed.field7) || 0,
    irrigationDecision: decodeIrrigationDecision(feed.field8),
    timestamp: new Date(feed.created_at),
  };
}

// Parse historical data for charts
function parseHistoricalData(feeds: ThingSpeakFeed[]): HistoricalDataPoint[] {
  return feeds.map((feed) => ({
    timestamp: new Date(feed.created_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    temperature: parseFloat(feed.field1) || 0,
    humidity: parseFloat(feed.field2) || 0,
    soilMoisture: parseFloat(feed.field3) || 0,
    rainProbability: parseFloat(feed.field4) || 0,
    yield: parseFloat(feed.field7) || 0,
  }));
}

// Calculate analytics from historical data
function calculateAnalytics(data: HistoricalDataPoint[]): AnalyticsData {
  if (data.length === 0) {
    return {
      avgTemperature: 0,
      avgHumidity: 0,
      avgSoilMoisture: 0,
      avgYield: 0,
      maxYield: 0,
      minYield: 0,
      totalRecords: 0,
    };
  }

  const sum = data.reduce(
    (acc, item) => ({
      temperature: acc.temperature + item.temperature,
      humidity: acc.humidity + item.humidity,
      soilMoisture: acc.soilMoisture + item.soilMoisture,
      yield: acc.yield + item.yield,
    }),
    { temperature: 0, humidity: 0, soilMoisture: 0, yield: 0 }
  );

  const yields = data.map((d) => d.yield);

  return {
    avgTemperature: sum.temperature / data.length,
    avgHumidity: sum.humidity / data.length,
    avgSoilMoisture: sum.soilMoisture / data.length,
    avgYield: sum.yield / data.length,
    maxYield: Math.max(...yields),
    minYield: Math.min(...yields),
    totalRecords: data.length,
  };
}

// Parse OpenWeather forecast
function parseWeatherData(forecastList: OpenWeatherForecastItem[]): WeatherData {
  const current = forecastList[0];
  const rainProbability = Math.round((current.pop || 0) * 100);

  return {
    temperature: current.main.temp,
    humidity: current.main.humidity,
    weatherMain: mapOpenWeatherWeather(current.weather[0]?.main || 'Clouds'),
    weatherDescription: current.weather[0]?.description || 'Cloudy',
    weatherIcon: current.weather[0]?.icon || '03d',
    rainProbability,
    windSpeed: current.wind.speed,
    location: 'Tadepalligudem',
  };
}

export function useDashboardData() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [thingspeakLatest, thingspeakHistory, openweather] = await Promise.all([
        ThingSpeakAPI.getLatestEntry(),
        ThingSpeakAPI.getHistoricalData(100),
        OpenWeatherAPI.getForecast(),
      ]);

      // Parse latest sensor data
      if (thingspeakLatest.data) {
        setSensorData(parseThingSpeakFeed(thingspeakLatest.data));
      }

      // Parse historical data
      if (thingspeakHistory.data?.feeds) {
        const parsed = parseHistoricalData(thingspeakHistory.data.feeds);
        setHistoricalData(parsed);
        setAnalytics(calculateAnalytics(parsed));
      }

      // Parse weather data
      if (openweather.data?.list) {
        setWeatherData(parseWeatherData(openweather.data.list));
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch data. Please check your connection.');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    sensorData,
    weatherData,
    historicalData,
    analytics,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchData,
  };
}
