var dgram = require("dgram");
var fs = require('fs');
var udpServer = require('./udp-server.js');

var udpServerLight = dgram.createSocket("udp4");
var udpServerButtonState = dgram.createSocket("udp4");

var lightlevel;
var buttonState; 
var particleIP = "192.168.43.177";
var udpLedChangePort = "8881";
var httpServerPort = 59552;

var saveLight = function(msg){
  lightlevel = msg;
}

var saveButtonState = function(msg){
  buttonState = msg;
};

udpServer.createListener(udpServerLight,3333,saveLight);
udpServer.createListener(udpServerButtonState,3334,saveButtonState);

var express = require('express');
var server = express();
var cors = require('cors');
server.use(cors());


server.use(express.static('public'));

server.get('/', function (req, res) {
  res.send(lightlevel.toString());
});

server.get('/mobile', function (req, res) {
  res.sendfile('./index.html');
});

server.get('/button-state', function (req, res) {
  res.send(buttonState.toString());
});

server.get('/led-on', function (req, res) {
 udpServer.sendMessage(new Buffer('1'), udpLedChangePort,particleIP);
 res.send("turned on led");
});

server.get('/led-off', function (req, res) {
 udpServer.sendMessage(new Buffer('0'), udpLedChangePort,particleIP);
 res.send("turned off led");
});

var httpServer = server.listen(httpServerPort, function () {
  var host = httpServer.address().address;
  var port = httpServer.address().port;

  console.log('listening at http://%s:%s', host, port);
});