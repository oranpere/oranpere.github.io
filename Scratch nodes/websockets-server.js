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
			console.log(msg);
			openSockets[id].send(JSON.stringify(msg));
		}

	});
	console.log("websockets server running on: " + port);
}

var sendToAllScratchXInstances = function sendToAllScratchXInstances(msg) {
	for (var i in openScratchXSockets) {
		console.log(msg);
		openScratchXSockets[i].send(JSON.stringify(msg));
	}
};


module.exports.socket = webSocketModule;
module.exports.sendToAllScratchXInstances = sendToAllScratchXInstances;