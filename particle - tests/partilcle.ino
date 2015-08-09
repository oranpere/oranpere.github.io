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

int red;
int green;
int blue;
char* receivedPacket[10];


void setup(){
  Serial.begin(9600);
  while(!Serial.available()) SPARK_WLAN_Loop();
  Spark.variable("red", &red, INT);
  Spark.variable("green", &green, INT);
  Spark.variable("blue", &blue, INT);
  Spark.variable("packet", &receivedPacket, STRING);
  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(ledPin,OUTPUT);
  pinMode(lightResPin,INPUT);
  pinMode(ZAxisPin,INPUT);
  pinMode(XAxisPin,INPUT);
  pinMode(YAxisPin,INPUT);
  pinMode(MicPin,INPUT);

  digitalWrite(ledPin, HIGH);
  udp.begin(udpLocalPort);
  Serial.println("hi");
  delay(1000);
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
  if (udp.parsePacket() > 0) {
  char rgbInputcolorArray[11];
  udp.read(rgbInputcolorArray, 11);
  if(rgbInputcolorArray[10] != ';')
    return;
    int red = getRGBValueFromChars(rgbInputcolorArray[0],rgbInputcolorArray[1],rgbInputcolorArray[2]);
    int green = getRGBValueFromChars(rgbInputcolorArray[3],rgbInputcolorArray[4],rgbInputcolorArray[5]);
    int blue = getRGBValueFromChars(rgbInputcolorArray[6],rgbInputcolorArray[7],rgbInputcolorArray[8]);
    int ledNumber = rgbInputcolorArray[9];
    Serial.println(red);
    Serial.println(ledNumber);
    /*strip.setPixelColor(ledNumber,strip.Color(red,green,blue));*/
    /*strip.show();*/
  }

}

int calcNumber(char c){
  return c - '0';
}

int getRGBValueFromChars(char c0,char c1,char c2){
  return validateRGBValue(calcNumber(c0) *100 + calcNumber(c1) *10 + calcNumber(c2));
}

int validateRGBValue(int colorInteger){
  if(colorInteger < 0)
    return 0;
  if(colorInteger > 255)
    return 255;
  return colorInteger;
}

bool isValidNumberOfDigitsForColorArray(int pos){
  return pos == 9;
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
