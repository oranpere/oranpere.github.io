var dgram = require("dgram");
var udpServer = require('./udp-server.js');
var httpServerModule = require("./http-server");
var webSocketModule = require("./websockets-server");

var udpServerLight = dgram.createSocket("udp4");
var udpServerButtonState = dgram.createSocket("udp4");

var lightlevelMsg = "";
var buttonStateMsg = ""; 

var httpServerPort = 59552;

var saveLight = function(msg){
  udpServer.lightLevelMsg = {'type':'light-level','data':msg.toString()};
}

var saveButtonState = function(msg){
  udpServer.buttonStateMsg = {'type':'button-state','data':msg.toString()};
};

udpServer.createListener(udpServerLight,3333,saveLight);
udpServer.createListener(udpServerButtonState,3334,saveButtonState);

var drumsMsg = function(){
  var msg = {
    type: "playDrum",
  };
  return msg;
}

httpServerModule(httpServerPort);
webSocketModule(udpServer,8080);