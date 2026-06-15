#include "model.h"

#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ThingSpeak.h>
#include <DHT.h>
#include <Wire.h>
#include <U8g2lib.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define SOIL_PIN 34
#define RELAY_PIN 26
#define NEXT_BTN 18
#define SELECT_BTN 19

DHT dht(DHTPIN, DHTTYPE);

U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0);

const char* ssid = "--WiFi_Name--";
const char* password = "--WiFi_Pass--";

WiFiClient client;

int dryValue = 3500;
int wetValue = 1500;

int pumpStatus = 0;
int irrigationDecision = 0;

constexpr int kTensorArenaSize = 20 * 1024;
uint8_t tensor_arena[kTensorArenaSize];

tflite::MicroInterpreter* interpreter_ptr;
TfLiteTensor* input;
TfLiteTensor* output;

// Mean values from scaler
float mean[15] = {
  27.03078,65.87557,61.23298,48.23265,
  0.6968,0.6968,
  0.25,0.25,0.25,0.25,
  0.1683,0.1664,0.1471,0.2138,0.3044
};

// Scale values from scaler
float scaleVal[15] = {
  6.43697915,
  17.17948178,
  18.82620924,
  23.37959484,
  0.4596409,
  0.4596409,
  0.4330127,
  0.4330127,
  0.4330127,
  0.4330127,
  0.37413248,
  0.37243931,
  0.35420558,
  0.40998727,
  0.46015284
};


float predictYield(float temp,
                   float humidity,
                   float moisture,
                   float rainProb,
                   int pumpStatus,
                   int irrigationDecision,
                   String crop,
                   String weather)
{
  float features[15];

  features[0] = temp;
  features[1] = humidity;
  features[2] = moisture;
  features[3] = rainProb;
  features[4] = pumpStatus;
  features[5] = irrigationDecision;

  // Crop Encoding
  features[6] = 0;
  features[7] = 0;
  features[8] = 0;
  features[9] = 0;

  if (crop == "Chilli") features[6] = 1;
  if (crop == "Rice")   features[7] = 1;
  if (crop == "Tomato") features[8] = 1;
  if (crop == "Wheat")  features[9] = 1;

  // Weather Encoding
  features[10] = 0;
  features[11] = 0;
  features[12] = 0;
  features[13] = 0;
  features[14] = 0;

  if (weather == "Cloudy")        features[10] = 1;
  if (weather == "Foggy")         features[11] = 1;
  if (weather == "Partly Cloudy") features[12] = 1;
  if (weather == "Rainy")         features[13] = 1;
  if (weather == "Sunny")         features[14] = 1;

  // Normalization
  for (int i = 0; i < 15; i++) {
    features[i] = (features[i] - mean[i]) / scaleVal[i];
    input->data.f[i] = features[i];
  }

  if (interpreter_ptr->Invoke() != kTfLiteOk) {
    Serial.println("Inference Failed");
    return -1;
  }

  return output->data.f[0];
}
int getMoisture()
{
  int raw = analogRead(SOIL_PIN);

  int moisture =
      map(raw,
          dryValue,
          wetValue,
          0,
          100);

  moisture = constrain(
      moisture,
      0,
      100);

  return moisture;
}
String crops[] = {
  "Rice",
  "Wheat",
  "Tomato",
  "Chilli"
};

int cropIndex = 0;

String selectedCrop = "Rice";
bool cropSelected = false;
void selectCrop()
{
  while(!cropSelected)
  {
    if(digitalRead(NEXT_BTN) == LOW)
    {
      cropIndex++;

      if(cropIndex > 3)
        cropIndex = 0;

      delay(250);
    }

    if(digitalRead(SELECT_BTN) == LOW)
    {
      selectedCrop = crops[cropIndex];

      cropSelected = true;

      delay(250);
    }

    u8g2.clearBuffer();

    u8g2.setCursor(0,15);
    u8g2.print("SELECT CROP");

    u8g2.setCursor(0,35);
    u8g2.print("> ");
    u8g2.print(crops[cropIndex]);

    u8g2.setCursor(0,60);
    u8g2.print("SEL=Confirm");

    u8g2.sendBuffer();
  }
}
void controlPump(String crop, int moisture)
{
  bool pumpOn = false;

  if(crop == "Rice")
  {
    if(moisture < 80)
      pumpOn = true;
  }

  else if(crop == "Wheat")
  {
    if(moisture < 50)
      pumpOn = true;
  }

  else if(crop == "Tomato")
  {
    if(moisture < 55)
      pumpOn = true;
  }

  else if(crop == "Chilli")
  {
    if(moisture < 45)
      pumpOn = true;
  }

  digitalWrite(RELAY_PIN, pumpOn ? HIGH : LOW);
}
String API_KEY = "--OpenWeatherMap_API--";

String weatherCondition = "Sunny";
int rainProbability = 0;

void getWeatherForecast()
{
    if(WiFi.status() != WL_CONNECTED)
        return;

    HTTPClient http;
    // change latitude and longitude value according to your location
    String url =
    "http://api.openweathermap.org/data/2.5/forecast?lat=16.815&lon=81.526&appid="
    + API_KEY +
    "&units=metric";

    http.begin(url);

    int httpCode = http.GET();

    if(httpCode == 200)
    {
        String payload = http.getString();

        DynamicJsonDocument doc(30000);

        deserializeJson(doc, payload);

        JsonObject forecast = doc["list"][0];

        String apiWeather =
    forecast["weather"][0]["main"].as<String>();

weatherCondition =
    mapWeather(apiWeather);

rainProbability =
    forecast["pop"].as<float>() * 100;

Serial.print("API Weather = ");
Serial.println(apiWeather);

Serial.print("Mapped Weather = ");
Serial.println(weatherCondition);

        Serial.println("Weather Updated");

        Serial.print("Weather = ");
        Serial.println(weatherCondition);

        Serial.print("Rain Probability = ");
        Serial.println(rainProbability);
    }
    else
    {
        Serial.println("Weather API Failed");
    }

    http.end();
}
String mapWeather(String apiWeather)
{
    apiWeather.toLowerCase();

    if(apiWeather == "clear")
        return "Sunny";

    if(apiWeather == "clouds")
        return "Cloudy";

    if(apiWeather == "rain")
        return "Rainy";

    if(apiWeather == "drizzle")
        return "Rainy";

    if(apiWeather == "thunderstorm")
        return "Rainy";

    if(apiWeather == "mist")
        return "Foggy";

    if(apiWeather == "fog")
        return "Foggy";

    if(apiWeather == "haze")
        return "Foggy";

    if(apiWeather == "smoke")
        return "Foggy";

    return "Cloudy";
}
void uploadToThingSpeak(
    float temp,
    float hum,
    int moisture,
    int rainProb,
    float yieldPred)
{
    ThingSpeak.setField(1, temp);
    ThingSpeak.setField(2, hum);
    ThingSpeak.setField(3, moisture);
    ThingSpeak.setField(4, rainProb);
    ThingSpeak.setField(5, cropEncode(selectedCrop));
    ThingSpeak.setField(6, digitalRead(RELAY_PIN));
    ThingSpeak.setField(7, yieldPred);
    ThingSpeak.setField(8, digitalRead(RELAY_PIN));
// change the channel id and write API below
    int status =
      ThingSpeak.writeFields(
        channel_ID,
        "--Write_API--");

    Serial.print("ThingSpeak Status: ");
    Serial.println(status);
}
int cropEncode(String crop)
{
    if(crop == "Rice")
        return 0;

    if(crop == "Wheat")
        return 1;

    if(crop == "Tomato")
        return 2;

    if(crop == "Chilli")
        return 3;

    return 0;
}
void setup() {
pinMode(RELAY_PIN,OUTPUT);

pinMode(NEXT_BTN, INPUT_PULLUP);
pinMode(SELECT_BTN, INPUT_PULLUP);

digitalWrite(RELAY_PIN,LOW);
  Serial.begin(115200);

  dht.begin();

  u8g2.begin();
  u8g2.setFont(u8g2_font_6x12_tr);
  selectCrop();



WiFi.begin(ssid,password);

while(WiFi.status()!=WL_CONNECTED)
{
    delay(500);
    Serial.print(".");
}

ThingSpeak.begin(client);

Serial.println("WiFi Connected");


  const tflite::Model* model =
      tflite::GetModel(crop_yield_model_tflite);

  static tflite::MicroMutableOpResolver<5> resolver;

  resolver.AddFullyConnected();
  resolver.AddRelu();
  resolver.AddReshape();
  resolver.AddQuantize();
  resolver.AddDequantize();

  static tflite::MicroInterpreter static_interpreter(
      model,
      resolver,
      tensor_arena,
      kTensorArenaSize);

  interpreter_ptr = &static_interpreter;

  if (interpreter_ptr->AllocateTensors() != kTfLiteOk) {
    Serial.println("Tensor Allocation Failed");
    while (1);
  }

  input = interpreter_ptr->input(0);
  output = interpreter_ptr->output(0);

  Serial.println("Tensor Allocation Success");
}

void loop()
{
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum))
  {
    Serial.println("DHT Read Failed");
    delay(2000);
    return;
  }

  int raw = analogRead(SOIL_PIN);

  int moisture = map(
      raw,
      dryValue,
      wetValue,
      0,
      100);
  controlPump(selectedCrop, moisture);

  moisture = constrain(
      moisture,
      0,
      100);

  Serial.println("--------------------------------");
  Serial.print("Crop = ");
Serial.println(selectedCrop);

Serial.print("Crop Code = ");
Serial.println(cropEncode(selectedCrop));

  Serial.print("Temp = ");
  Serial.println(temp);

  Serial.print("Humidity = ");
  Serial.println(hum);

  Serial.print("Moisture = ");
  Serial.println(moisture);

  Serial.print("Pump = ");

if(digitalRead(RELAY_PIN))
    Serial.println("ON");
else
    Serial.println("OFF");

  // Test Values
String crop = selectedCrop;
getWeatherForecast();

int rainProb = rainProbability;
String weather = weatherCondition;

int pumpStatusModel = digitalRead(RELAY_PIN);

float yieldPred =
predictYield(
    temp,
    hum,
    moisture,
    rainProb,
    pumpStatusModel,
    pumpStatusModel,
    crop,
    weather);

  Serial.print("Yield = ");
  Serial.println(yieldPred);

  Serial.println("--------------------------------");
  uploadToThingSpeak(
    temp,
    hum,
    moisture,
    rainProb,
    yieldPred);

  u8g2.clearBuffer();

  u8g2.setCursor(0, 15);
  u8g2.print("Crop:");
  u8g2.print(crop);

  u8g2.setCursor(0, 30);
  u8g2.print("Temp:");
  u8g2.print(temp);

  u8g2.setCursor(0, 45);
  u8g2.print("Hum:");
  u8g2.print(hum);

  u8g2.setCursor(0, 60);
  u8g2.print("Yield:");
  u8g2.print(yieldPred);

  u8g2.setCursor(70,60);

if(digitalRead(RELAY_PIN))
    u8g2.print("P:ON");
else
    u8g2.print("P:OFF");

u8g2.setCursor(70,45);
u8g2.print("Wea:");
u8g2.print(weather);

u8g2.setCursor(70,30);
u8g2.print("Ra:");
u8g2.print(rainProb);
u8g2.print("%");

u8g2.setCursor(70,15);
u8g2.print("Mo:");
u8g2.print(moisture);
u8g2.print("%");

  u8g2.sendBuffer();

  delay(5000);
}
