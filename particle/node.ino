const int btn1Pin = D0;
const int ledPin = D7;
const int lightResPin = A0;
int isClicked = 1;
int changeLedState(String command);
int lightIntensity = 0;

void setup(){
  Spark.variable("isclicked", &isClicked, INT);
  Spark.variable("lightval", &lightIntensity, INT);
  Spark.function("changeled",changeLedState);

  pinMode(btn1Pin, INPUT_PULLUP);
  pinMode(ledPin,OUTPUT);
  pinMode(lightResPin,INPUT);
}

void loop(){
  lightIntensity = analogRead(A0);
  if(checkClick(btn1Pin))
    isClicked = 1;
  else
    isClicked = 0;
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
