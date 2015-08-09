var dgram = require("dgram");
var udpServer = require('./udp-server.js');
var httpServerModule = require("./http-server");
var webSocketModule = require("./websockets-server");

var udpSocket = dgram.createSocket("udp4");

var httpServerPort = 59552;


function rgbLedsHandler(msg) {
  udpServer.sendMessage(new Buffer(msg.data), msg.target_id);
}



var saveLight = function (msg) {
  var message = { 'type': 'light-level', 'data': msg.value, 'node_id': msg.id };
  webSocketModule.sendToAllScratchXInstances(message);
}

var saveButtonState = function (msg) {
  var message = { 'type': 'button-state', 'data': msg.value, 'node_id': msg.id };
  webSocketModule.sendToAllScratchXInstances(message);
};

var saveMicState = function (msg) {
  var message = { 'type': 'mic-value', 'data': msg.value, 'node_id': msg.id };
  webSocketModule.sendToAllScratchXInstances(message);
};

var saveXAxisState = function (msg) {
  var message = { 'type': 'x-axis-value', 'data': msg.value, 'node_id': msg.id };
  webSocketModule.sendToAllScratchXInstances(message);
};

var saveYAxisState = function (msg) {
  var message = { 'type': 'y-axis-value', 'data': msg.value, 'node_id': msg.id };
  webSocketModule.sendToAllScratchXInstances(message);
};

var saveZAxisState = function (msg) {
  var message = { 'type': 'z-axis-value', 'data': msg.value, 'node_id': msg.id };
  webSocketModule.sendToAllScratchXInstances(message);
};
 
udpServer.createListener(udpSocket, 27001, saveLight, saveButtonState,saveMicState,saveXAxisState,saveYAxisState,saveZAxisState);



httpServerModule(httpServerPort);
webSocketModule.socket(rgbLedsHandler, 59553);
