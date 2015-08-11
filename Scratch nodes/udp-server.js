// Copyright (C) 2015 Massachusetts Institute of Technology
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 2,
// as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

// Oran Peretz 2015
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
 