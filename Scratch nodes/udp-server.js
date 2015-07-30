var dgram = require("dgram");
var fs = require('fs');
var server = dgram.createSocket("udp4");
var lightlevel;
var particleIP = "";
var particlePort = "";

server.on("message", function (msg, rinfo) {
lightlevel = msg;
  console.log(rinfo.address + ':' + rinfo.port +' - ' + msg);
  if (particleIP == ""){
    particleIP = rinfo.address;
    particlePort = rinfo.port;
  }
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});
server.bind(3333);


var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
app.get('/', function (req, res) {
  res.send(lightlevel.toString());
  console.log(lightlevel.toString());
});

app.get('/led-on', function (req, res) {
 sendLedState(new Buffer('1'));
  console.log("turn on led");
});

app.get('/led-off', function (req, res) {
  sendLedState(new Buffer('0'));
  console.log("turn off led");
});

var server = app.listen(59552, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var sendLedState = function(message) {
var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, particlePort, particleIP, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + particleIP +':'+ particlePort);
    client.close();
});
};