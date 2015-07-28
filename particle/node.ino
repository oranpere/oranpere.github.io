
int isClicked = 1;
const int btn1Pin = D0;

void setup(){
  Spark.variable("sensorvalue", &isClicked, INT);
  pinMode(btn1Pin, INPUT_PULLUP);
}

void loop(){
  if(checkClick(btn1Pin))
    isClicked = 1;
  else
    isClicked = 0;
    delay(100);
}

bool checkClick(pin){
  if(digitalRead(pin) == LOW)
    return true;
  return false;
}
