const int btn1Pin = D0;
const int ledPin = D7;
const int lightResPin = A0;
bool isClicked = false;
int lightIntensity = 0;

UDP UdpLightRes;
const int udpLightResPort = 8880;

UDP UdpLed;
const int udpLedPort = 8881;

UDP UdpButton;
const int udpButtonPort = 8882;

void setup(){
  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(ledPin,OUTPUT);
  pinMode(lightResPin,INPUT);

  UdpLightRes.begin(udpLightResPort);
  UdpLed.begin(udpLedPort);
  UdpButton.begin(udpButtonPort);
}

void loop(){
    handleButtonClicks();
    udpGetLedState();
    udpSendLightIntensity();
    udpSendButtonState();
}

void udpSendButtonState(){
  UdpButton.beginPacket("192.168.43.132", 3334);
  if(isClicked){
    UdpButton.write('1');
  }else{
    UdpButton.write('0');
  }
  UdpButton.endPacket();
}

char c;
void udpGetLedState(){
  if (UdpLed.parsePacket() > 0) {
    c = UdpLed.read();

    UdpLed.flush();
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

char packet[5];
void udpSendLightIntensity(){
  lightIntensity = analogRead(A0);
  UdpLightRes.beginPacket("192.168.43.132", 3333);
  sprintf(packet, "%d", lightIntensity);
  UdpLightRes.write(packet);
  UdpLightRes.endPacket();
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
