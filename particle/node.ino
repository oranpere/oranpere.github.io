const int btn1Pin = D0;
const int ledPin = D7;

int isClicked = 1;
int changeLedState(String command);

void setup(){
  Spark.variable("isclicked", &isClicked, INT);
  Spark.function("changeled",changeLedState);

  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(ledPin,OUTPUT);
}

void loop(){
  if(checkClick(btn1Pin))
    isClicked = 1;
  else
    isClicked = 0;
    delay(100);
}

bool checkClick(int pin){
  if(digitalRead(pin) == LOW)
    return true;
  return false;
}

int changeLedState(String command){
    if(command == "on"){
        turnOnLed();
        return 1;
    }

    if(command == "off"){
        turnOffLed();
        return 1;
    }

    return 0;
}

void turnOnLed(){
    digitalWrite(ledPin,HIGH);
}

void turnOffLed(){
    digitalWrite(ledPin,LOW);
}
