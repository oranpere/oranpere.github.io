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
var openSockets = [];
var openedSocketsCount = 0;
var openScratchXSockets = [];


var webSocketModule = function (rgbLedsHandler, port) {
	var WebSocketServer = require('ws').Server
		, wss = new WebSocketServer({ port: port });


	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			console.log(message);
			var msg;
			try {
				msg = JSON.parse(message);
				switch (msg.type) {
					case "play-drum":
						var drumMsg = { 'type': "play-drum", 'drum_id': msg.drum_id };
						sendMessage(drumMsg, msg.target_id);
						log('playing drum');
						break;
					case "set-id":
						log("set node id :" + msg.data);
						ws.id = msg.data.toString();
						openSockets[ws.id] = ws;
						break;
					case "set-id-scratch-x":
						log("set scratch x id :" + msg.data);
						ws.id = msg.data.toString();
						openScratchXSockets[ws.id] = ws;
						break;
					case "set-led-rgb":
						log("set led rgb: " + msg.data + "target id :" + msg.target_id);
						rgbLedsHandler(msg);
						break;
					case "get-id":
						log("new node id :" + msg.data);
						ws.id = openedSocketsCount;
						openedSocketsCount++;
						openSockets[ws.id] = ws;
						var assignIdMsg = { 'type': "assign-id", 'id': ws.id };
						sendMessage(assignIdMsg, ws.id);
						break;
				}
			} catch (e) {
				console.log('websockets - failed to parse message' + e);
			}
		});
		function log(msg) {
			console.log(msg);
		}
		function sendMessage(msg, id) {
			if (openSockets[id].readyState === 1)
				openSockets[id].send(JSON.stringify(msg));
		}

	});
	console.log("websockets server running on: " + port);
}

var sendToAllScratchXInstances = function sendToAllScratchXInstances(msg) {
	for (var i in openScratchXSockets) {
		// console.log(msg);
		if (openScratchXSockets[i].readyState === 1)
			openScratchXSockets[i].send(JSON.stringify(msg));
	}
};


module.exports.socket = webSocketModule;
module.exports.sendToAllScratchXInstances = sendToAllScratchXInstances;