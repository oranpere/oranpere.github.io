var dgram = require("dgram");

var createListener = function(dgramSocket,port,messageHandler) {
  dgramSocket.on("message", function (msg, rinfo) {
  messageHandler(msg);
  });
  dgramSocket.on("listening", function () {
    var address = dgramSocket.address();
    console.log("server listening " + address.address + ":" + address.port);
  });
  dgramSocket.bind(port);
};

var sendMessage = function(message,port,particleIP) {
  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, port, particleIP, function(err, bytes) {
      if (err) throw err;
      console.log('UDP message sent to ' + particleIP +':'+ port);
      client.close();
  });
};

module.exports.createListener = createListener;
module.exports.sendMessage = sendMessage;
