var dgram = require("dgram");
var udpParticlePorts = "27000";
var particleIPS = [];
var messengingClient = [];

var createListener = function (dgramSocket, port, lightHandelr, buttonHandler, micHandler, xHandler, yHandler, zHandler) {
  dgramSocket.on("message", function (message, rinfo) {
    try {
      console.log(message.toString());
      msg = JSON.parse(message.toString());
      //List particle core id to adress it later on
      if (typeof particleIPS[msg.id] === 'undefined') {
        particleIPS[msg.id] = rinfo.address;
      }
      switch (msg.sensor) {
        case "button":
          buttonHandler(msg);
          break;
        case "light":
          lightHandelr(msg);
          break;
        case "mic":
          micHandler(msg);
          break;
        case "x-axis":
          xHandler(msg);
          break;
        case "y-axis":
          yHandler(msg);
          break;
        case "z-axis":
          zHandler(msg);
          break;
      }
    } catch (e) {
      console.log('udp - failed to parse message error: ' + e);
    }

  });
  dgramSocket.on("listening", function () {
    var address = dgramSocket.address();
    console.log("server listening " + address.address + ":" + address.port);
  });
  dgramSocket.bind(port);
};

var sendMessage = function (message, particleId) {
  try {
    if (typeof messengingClient[particleId] === 'undefined') {
      messengingClient[particleId] = dgram.createSocket('udp4');
    }
    console.log(particleIPS[particleId]);
    console.log(message);
    messengingClient[particleId].send(message, 0, message.length, udpParticlePorts, particleIPS[particleId]);
  }
  catch (e) {
    console.log('udp sending message error: ' + e);
  }
};

module.exports.createListener = createListener;
module.exports.sendMessage = sendMessage;
 