#include "neopixel.h"

const int btn1Pin = D0;
const int ledPin = D7;
const int lightResPin = A0;
const int ZAxisPin = A1;
const int YAxisPin = A2;
const int XAxisPin = A3;
const int MicPin = A4;
const char* server = "192.168.43.132";
const char* id = "red";
const char* messageTemplate = "{\"id\":\"%s\",\"sensor\":\"%s\",\"value\":\"%d\"}";
const int delayMilis = 3;
bool isClicked = false;
bool previousIsClicked = false;
int previousAnalogValues[5] = {0,0,0,0,0};
char packet[60];
UDP udp;
const int udpLocalPort = 27000;
const int udpServerPort = 27001;

#define PIXEL_COUNT 8
#define PIXEL_TYPE WS2812B
Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, ledPin, PIXEL_TYPE);
const int BLACK = strip.Color(0,0,0);
const int RED = strip.Color(10,0,0);

void setup(){
  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(ledPin,OUTPUT);
  pinMode(lightResPin,INPUT);
  pinMode(ZAxisPin,INPUT);
  pinMode(XAxisPin,INPUT);
  pinMode(YAxisPin,INPUT);
  pinMode(MicPin,INPUT);
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'

  digitalWrite(ledPin, HIGH);
  udp.begin(udpLocalPort);
}

void loop(){
    registerButtonClick();
    delay(delayMilis);
    udpGetLedState();
    delay(delayMilis);
    udpSendLightIntensity();
    delay(delayMilis);
    udpSendButtonState();
    delay(delayMilis);
    udpSendMic();
    delay(delayMilis);
    udpSendYAxis();
    delay(delayMilis);
    udpSendXAxis();
    delay(delayMilis);
    udpSendZAxis();
    delay(delayMilis);
}

void udpSendButtonState(){
  if(isClicked == previousIsClicked)
    return;
  udp.beginPacket(server, udpServerPort);
  if(isClicked){
    sprintf(packet, messageTemplate, id, "button", 1);
  }else{
    sprintf(packet, messageTemplate, id, "button", 0);
  }
  udp.write(packet);
  udp.endPacket();
}

void udpGetLedState(){
  int pos = 0;
  char rgbInputcolorArray[10];

  while (udp.parsePacket() > 0) {
    char c =  udp.read();
    if(isdigit(c)){
      rgbInputcolorArray[pos] = c;
      pos++;
    }
  }

  udp.flush();
  if(isValidNumberOfDigitsForColorArray(pos)){
    int red = {rgbInputcolorArray[0]*100+rgbInputcolorArray[1]*10+rgbInputcolorArray[2]};
    int green = {rgbInputcolorArray[3]*100+rgbInputcolorArray[4]*10+rgbInputcolorArray[5]};
    int blue = {rgbInputcolorArray[6]*100+rgbInputcolorArray[7]*10+rgbInputcolorArray[8]};
    strip.setPixelColor(rgbInputcolorArray[9],red,green,blue);
  }
  pos = 0;
}

bool isValidNumberOfDigitsForColorArray(int count){
  return count == 10;
}

void registerButtonClick(){
  previousIsClicked = isClicked;
  if(checkClick(btn1Pin))
    isClicked = true;
  else
    isClicked = false;
}

void udpSendLightIntensity(){
  int analogValue = checkForChangesBeyondThreshold(20,lightResPin,0);
  if(analogValue != -1)
    sendUdpPacket("light", analogValue);
}

void udpSendZAxis(){
  int analogValue = checkForChangesBeyondThreshold(100,ZAxisPin,1);
  if(analogValue != -1)
    sendUdpPacket("z-axis", analogValue);
}

void udpSendYAxis(){
  int analogValue = checkForChangesBeyondThreshold(100,YAxisPin,2);
  if(analogValue != -1)
    sendUdpPacket("y-axis", analogValue);
}

void udpSendXAxis(){
  int analogValue = checkForChangesBeyondThreshold(100,XAxisPin,3);
  if(analogValue != -1)
    sendUdpPacket("x-axis", analogValue);
}

void udpSendMic(){
  int analogValue = checkForChangesBeyondThreshold(300,MicPin,4);
  if(analogValue != -1)
    sendUdpPacket("mic", analogValue);
}

int checkForChangesBeyondThreshold(int threshold, int pin, int previousAnalogPosition){
  int tmp = analogRead(pin);

  if(abs(tmp - previousAnalogValues[previousAnalogPosition]) < threshold)
    return -1;
  previousAnalogValues[previousAnalogPosition] = tmp;
  return tmp;
}

void sendUdpPacket(char* sensor, int value){
  udp.beginPacket(server, udpServerPort);
  prepareMessage(sensor, value);
  udp.write(packet);
  udp.endPacket();
}

void prepareMessage(char* sensor, int value){
  sprintf(packet, messageTemplate, id, sensor, value);
}

bool checkClick(int pin){
  if(digitalRead(pin) == LOW)
    return true;
  return false;
}

void turnOnLed(){
    digitalWrite(ledPin,HIGH);
}

void turnOffLed(){
    digitalWrite(ledPin,LOW);
}

// Set all pixels in the strip to a solid color, then wait (ms)
void colorAll(uint32_t c) {
  uint16_t i;

  for(i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
  }
  strip.show();
}
