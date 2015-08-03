#include "Spark-Websockets.h"
WebSocketClient client;
SYSTEM_MODE(MANUAL);

const int btn1Pin = D0;
const int ledPin = D7;
const int lightResPin = A0;
bool isClicked = false;
int lightIntensity = 0;

void onMessage(WebSocketClient client, char* message) {
}
void setup(){
  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(ledPin,OUTPUT);
  pinMode(lightResPin,INPUT);

  client.onMessage(onMessage);
  client.connect("ws://192.168.43.132",80,"8");
}

void loop(){
  client.monitor();
  /*udpGetLedState();*/
  sendLightIntensity();
  sendButtonState();
  delay(50);
}

char buttonState[1];
void sendButtonState(){
  checkIfButtonIsClicked();
  if(isClicked){
    buttonState[0] = '1';
    client.send(buttonState);
  }else{
    buttonState[0] = '0';
    client.send(buttonState);
  }
}

/*char c;
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
}*/

void checkIfButtonIsClicked(){
  if(checkClick(btn1Pin))
    isClicked = true;
  else
    isClicked = false;
}

char charArray[5];
void sendLightIntensity(){
  sprintf(charArray,"%d",lightIntensity);
  client.send(charArray);
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
