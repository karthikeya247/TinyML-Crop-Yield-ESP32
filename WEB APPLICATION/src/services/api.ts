import axios from 'axios';

// ThingSpeak Configuration
const THINGSPEAK_CHANNEL_ID = 'YOUR_THINGSPEAK_CHANNEL_ID';
const THINGSPEAK_READ_API_KEY = 'YOUR_THINGSPEAK_READ_API_KEY';
const THINGSPEAK_BASE_URL = 'https://api.thingspeak.com/channels';

// OpenWeather Configuration
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';
const OPENWEATHER_LAT = 16.815;
const OPENWEATHER_LON = 81.526;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ThingSpeak API Endpoints
export const ThingSpeakAPI = {
  getLatestEntry: () =>
    axios.get(
      `${THINGSPEAK_BASE_URL}/${THINGSPEAK_CHANNEL_ID}/feeds/last.json?api_key=${THINGSPEAK_READ_API_KEY}`
    ),

  getHistoricalData: (results: number = 100) =>
    axios.get(
      `${THINGSPEAK_BASE_URL}/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=${results}`
    ),
};

// OpenWeather API Endpoints
export const OpenWeatherAPI = {
  getForecast: () =>
    axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${OPENWEATHER_LAT}&lon=${OPENWEATHER_LON}&appid=${OPENWEATHER_API_KEY}&units=metric`
    ),
};
