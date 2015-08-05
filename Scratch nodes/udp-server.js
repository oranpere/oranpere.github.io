var dgram = require("dgram");
var udpLedChangePort = "8881";
var particleIP = "192.168.43.177";

var createListener = function (dgramSocket, port, messageHandler) {
  dgramSocket.on("message", function (msg, rinfo) {
    messageHandler(msg);
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
