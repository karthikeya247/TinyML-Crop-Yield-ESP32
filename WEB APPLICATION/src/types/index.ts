// ThingSpeak Feed Data
export interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1: string; // Temperature
  field2: string; // Humidity
  field3: string; // Soil Moisture
  field4: string; // Rain Probability
  field5: string; // Crop Type (Encoded)
  field6: string; // Pump Status
  field7: string; // Predicted Yield
  field8: string; // Irrigation Decision
}

// ThingSpeak Response
export interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: ThingSpeakFeed[];
}

// OpenWeather Forecast Item
export interface OpenWeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

// OpenWeather Response
export interface OpenWeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: OpenWeatherForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Parsed Sensor Data
export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  rainProbability: number;
  cropType: string;
  pumpStatus: boolean;
  predictedYield: number;
  irrigationDecision: boolean;
  timestamp: Date;
}

// Weather Data
export interface WeatherData {
  temperature: number;
  humidity: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  rainProbability: number;
  windSpeed: number;
  location: string;
}

// Historical Data Point
export interface HistoricalDataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  rainProbability: number;
  yield: number;
}

// Analytics Data
export interface AnalyticsData {
  avgTemperature: number;
  avgHumidity: number;
  avgSoilMoisture: number;
  avgYield: number;
  maxYield: number;
  minYield: number;
  totalRecords: number;
}

// Dashboard State
export interface DashboardState {
  sensorData: SensorData | null;
  weatherData: WeatherData | null;
  historicalData: HistoricalDataPoint[];
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
