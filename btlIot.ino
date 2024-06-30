#include <Wire.h>
#include <DHT.h>
#include <BH1750.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <thread>

const int DHTPIN = 5;
const int DHTTYPE = DHT11;
const int ledPin = 2;
const int earthSensorPin = 35;
const int relayPin = 23;

// new code
const int led_status = 12;
const int buttonLed = 27;
const int pump_status = 14;
const int buttonPump = 26;

const char *ssid = "Vu Thi Lan";
const char *password = "0974020710";
const char *mqtt_server = "192.168.1.9";
const char *mqtt_client_id = "esp32_client";
const char *mqtt_topic = "esp32/data";
const char *mqtt_control_topic = "control";
const char *mqtt_username = "";
const char *mqtt_password = "";

const char *mqtt_from_esp32 = "from-esp32";

int ledAutoMode = 0;
int pumpAutoMode = 0;
int ledMode = 0;
int pumpMode = 0;

int swap_mode = 1;
int previousButtonState_led = LOW;

WiFiClient espClient;
PubSubClient mqttClient(espClient);
StaticJsonDocument<200> jsonData, jsonLedtPumpStatus;

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
BH1750 lightMeter(0x23);

unsigned long previousMillis = 0;
const long interval = 2000;

void connectWiFi()
{
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Đang kết nối WiFi...");
    delay(2000);
  }
  Serial.println("Đã kết nối WiFi");

  mqttClient.setServer(mqtt_server, 1883);

  if (!mqttClient.connected())
  {
    reconnectMQTT();
  }
}

void reconnectMQTT()
{
  while (!mqttClient.connected())
  {
    Serial.println("Đang thử kết nối MQTT...");
    if (mqttClient.connect(mqtt_client_id, mqtt_username, mqtt_password))
    {
      Serial.println("Đã kết nối tới MQTT broker");
      mqttClient.subscribe(mqtt_control_topic);
    }
    else
    {
      Serial.print("Kết nối thất bại, rc=");
      Serial.print(mqttClient.state());
      Serial.println("Thử lại sau 5 giây...");
      delay(5000);
    }
  }
}

void check_buttonAll()
{

  // pump
  int status_button_pump = digitalRead(pump_status);

  if (status_button_pump == LOW)
  {
    int status_button_pump_on_off = digitalRead(buttonPump);
    if (status_button_pump_on_off == LOW)
    {
      digitalWrite(relayPin, LOW);
    }
    else
    {
      digitalWrite(relayPin, HIGH);
    }
  }
  else
  {
    float earthMoisture = earthMoisturePercent(analogRead(earthSensorPin));
    pumpControl(earthMoisture);
  }

  // led
  int status_button_led = digitalRead(led_status);

  if (status_button_led == LOW)
  {
    int status_button_led_on_off = digitalRead(buttonLed);
    if (status_button_led_on_off == LOW)
    {
      digitalWrite(ledPin, HIGH);
      Serial.println("Bật");
    }
    else
    {
      digitalWrite(ledPin, LOW);
      Serial.println("Tắt");
    }
  }
  else
  {
    float lightValue = lightMeter.readLightLevel();
    ledControl(lightValue);
    Serial.println("Tự động");
  }
}

void setup()
{
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();

  dht.begin();
  Wire.begin();
  lightMeter.begin();
  pinMode(ledPin, OUTPUT);
  pinMode(earthSensorPin, INPUT);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);

  pinMode(buttonLed, INPUT_PULLUP);
  pinMode(buttonPump, INPUT_PULLUP);
  pinMode(led_status, INPUT_PULLUP);
  pinMode(pump_status, INPUT_PULLUP);

  connectWiFi();
  // std::thread manualControlThread(manualControl);
  // manualControlThread.detach();
}

void loop()
{

  check_buttonAll();

  lcd.clear();
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  float lightValue = lightMeter.readLightLevel();
  float earthMoisture = earthMoisturePercent(analogRead(earthSensorPin));
  printLCD(temperature, humidity, lightValue, earthMoisture);
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval)
  {
    previousMillis = currentMillis;

    if (!mqttClient.connected())
    {
      reconnectMQTT();
    }

    sendMQTTData(temperature, humidity, lightValue, earthMoisture);
  }
}

void sendMQTTData(float temperature, float humidity, float lightValue, float earthMoisture)
{
  jsonData["from"] = "esp32";
  jsonData["temperature"] = temperature;
  jsonData["humidity"] = humidity;
  jsonData["lightValue"] = lightValue;
  jsonData["earthMoisture"] = earthMoisture;

  char jsonString[200];
  serializeJson(jsonData, jsonString);

  mqttClient.publish(mqtt_topic, jsonString);
}

void pumpControl(float earthMoisture)
{
  if (earthMoisture < 30)
  {
    digitalWrite(relayPin, LOW);
    pumpMode = 1;
  }
  else
  {
    digitalWrite(relayPin, HIGH);
    pumpMode = 0;
  }
}

float earthMoisturePercent(int analog)
{
  float virtualPercent = map(analog, 0, 4095, 0, 100);
  float result = 100 - virtualPercent;
  return result;
}

void ledControl(float lightValue)
{
  if (lightValue < 30)
  {
    digitalWrite(ledPin, HIGH);
    ledMode = 1;
  }
  else
  {
    digitalWrite(ledPin, LOW);
    ledMode = 0;
  }
}

void printSerial(float temperature, float humidity, float lightValue, float earthMoisture)
{
  Serial.print("Nhiet do: ");
  Serial.print(temperature);
  Serial.println(" C");

  Serial.print("Do am: ");
  Serial.print(humidity);
  Serial.println("%");

  Serial.print("Anh sang: ");
  Serial.print(lightValue);
  Serial.println(" lx");

  Serial.print("Do am dat: ");
  Serial.print(earthMoisture);
  Serial.println("%");
}

void printLCD(float temperature, float humidity, float lightValue, float earthMoisture)
{
  lcd.setCursor(0, 0);
  lcd.print(temperature);
  lcd.print("C");

  lcd.setCursor(8, 0);
  lcd.print(humidity);
  lcd.print("%");

  lcd.setCursor(0, 1);
  lcd.print(lightValue);
  lcd.print("lx");

  lcd.setCursor(10, 1);
  lcd.print(earthMoisture);
  lcd.print("%");
}