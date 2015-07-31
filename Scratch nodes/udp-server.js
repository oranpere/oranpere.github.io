var dgram = require("dgram");
var fs = require('fs');
var udpServerLight = dgram.createSocket("udp4");
var udpServerButtonState = dgram.createSocket("udp4");
var lightlevel;
var buttonState; 
var particleIP = "";
var udpLedChangePort = "8881";

var saveLight = function(msg){
  lightlevel = msg;
}

var setupUdpServer = function(dgramSocket,port,messageHandler) {
  dgramSocket.on("message", function (msg, rinfo) {
  messageHandler(msg);
  if (particleIP == ""){
    particleIP = rinfo.address;
  }
  });
  dgramSocket.on("listening", function () {
    var address = dgramSocket.address();
    console.log("server listening " + address.address + ":" + address.port);
  });
  dgramSocket.bind(port);
};

var saveButtonState = function(msg){
  buttonState = msg;
};

setupUdpServer(udpServerLight,3333,saveLight);
setupUdpServer(udpServerButtonState,3334,saveButtonState);

var sendLedState = function(message,port) {
  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, port, particleIP, function(err, bytes) {
      if (err) throw err;
      console.log('UDP message sent to ' + particleIP +':'+ port);
      client.close();
  });
};

var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());

app.get('/', function (req, res) {
  res.send(lightlevel.toString());
  // console.log(lightlevel.toString());
});

app.get('/button-state', function (req, res) {
  res.send(buttonState.toString());
});

app.get('/led-on', function (req, res) {
 sendLedState(new Buffer('1'), udpLedChangePort);
 res.send("turned on led");
});

app.get('/led-off', function (req, res) {
  sendLedState(new Buffer('0'), udpLedChangePort);
 res.send("turned off led");
});

var httpServer = app.listen(59552, function () {
  var host = httpServer.address().address;
  var port = httpServer.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});