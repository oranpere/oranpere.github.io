const int btn1Pin = D0;
const int ledPin = D7;
const int lightResPin = A0;
bool isClicked = false;
int lightIntensity = 0;
char packet[60];

UDP udp;
const int udpLocalPort = 8880;
const int udpServerPort = 3333;

void setup(){
  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(ledPin,OUTPUT);
  pinMode(lightResPin,INPUT);
  digitalWrite(ledPin, HIGH);
  udp.begin(udpLocalPort);
}

void loop(){
    handleButtonClicks();
    delay(5);
    udpGetLedState();
    delay(5);
    udpSendLightIntensity();
    delay(5);
    udpSendButtonState();
    delay(5);
}

void udpSendButtonState(){
  udp.beginPacket("192.168.43.132", udpServerPort);
  if(isClicked){
    sprintf(packet, "{\"id\":\"p2\",\"sensor\":\"button\",\"value\":\"%d\"}", 1);
  }else{
    sprintf(packet, "{\"id\":\"p2\",\"sensor\":\"button\",\"value\":\"%d\"}", 0);
  }
  udp.write(packet);
  udp.endPacket();
}

char c = '\0';
void udpGetLedState(){
  while (udp.parsePacket() > 0) {
    c = udp.read();
    udp.flush();
    if(c == '1')
      turnOnLed();
    if(c == '0')
      turnOffLed();
    c='\0';
  }
}

void handleButtonClicks(){
  if(checkClick(btn1Pin))
    isClicked = true;
  else
    isClicked = false;
}


void udpSendLightIntensity(){
  lightIntensity = analogRead(A0);
  udp.beginPacket("192.168.43.132", udpServerPort);
  sprintf(packet, "{\"id\":\"p2\",\"sensor\":\"light\",\"value\":\"%d\"}", lightIntensity);
  udp.write(packet);
  udp.endPacket();
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
