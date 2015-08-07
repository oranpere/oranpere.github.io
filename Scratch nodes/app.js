var dgram = require("dgram");
var udpServer = require('./udp-server.js');
var httpServerModule = require("./http-server");
var webSocketModule = require("./websockets-server");

var udpSocket = dgram.createSocket("udp4");

udpServer.lightLevelMsg = [];
udpServer.buttonStateMsg = [];

var httpServerPort = 59552;

var saveLight = function (msg) {
  udpServer.lightLevelMsg[msg.id] = { 'type': 'light-level', 'data': msg.value, 'nodei-id': msg.id };
}

var saveButtonState = function (msg) {
  udpServer.buttonStateMsg[msg.id] = { 'type': 'button-state', 'data': msg.value, 'nodei-id': msg.id };
};

udpServer.createListener(udpSocket, 27001, saveLight, saveButtonState);

httpServerModule(httpServerPort);
webSocketModule(udpServer, 8080);