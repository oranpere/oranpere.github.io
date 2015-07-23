
int sensorValue = 1;

void setup(){
  Spark.variable("sensorvalue", &sensorValue, INT);
}

void loop(){
  sensorValue = (sensorValue * 3) % 1000;
  delay(1000);
}
