var dgram = require("dgram");
var udpLedChangePort = "8881";
var particleIPS = [];

var createListener = function (dgramSocket, port, lightHandelr, buttonHandler) {
  dgramSocket.on("message", function (message, rinfo) {
    try {
      console.log(message.toString());
      msg = JSON.parse(message.toString());
      switch (msg.sensor) {
        case "button":
          if (typeof particleIPS[msg.id] === 'undefined') {
            particleIPS[msg.id] = rinfo.address;
          }
          buttonHandler(msg);
          break;
        case "light":
          if (typeof particleIPS[msg.id] === 'undefined') {
            particleIPS[msg.id] = rinfo.address;
          }
          lightHandelr(msg);
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

var sendLedChangeMessage = function (message) {
  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, udpLedChangePort, particleIP, function (err, bytes) {
    if (err) throw err;
    // console.log('UDP message sent to ' + particleIP + ':' + udpLedChangePort);
    client.close();
  });
};

module.exports.createListener = createListener;
module.exports.sendLedChangeMessage = sendLedChangeMessage;
 