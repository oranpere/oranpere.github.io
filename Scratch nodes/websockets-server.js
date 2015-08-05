var webSocketModule = function (messenger, port) {
	var WebSocketServer = require('ws').Server
		, wss = new WebSocketServer({ port: port });
	var openSockets = [];
	var openedSocketsCount = 0;
	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			console.log(message);
			var msg;
			try {
				msg = JSON.parse(message);
				switch (msg.type) {
					case "turn-led-on":
						log('turning leds on');
						messenger.sendMessage(new Buffer('1'), msg.target_id);
						break;
					case "turn-led-off":
						messenger.sendMessage(new Buffer('0'), msg.target_id);
						log('turning leds off');
						break;
					case "get-light-level":
						if (typeof messenger.lightLevelMsg[msg.particle_id] === 'undefined')
							return;
						sendMessage(messenger.lightLevelMsg[msg.particle_id], msg.target_id);
						log('getting light level');
						break;
					case "get-button-state":
						if (typeof messenger.buttonStateMsg[msg.particle_id] === 'undefined')
							return;
						sendMessage(messenger.buttonStateMsg[msg.particle_id], msg.target_id);
						log('turning leds off');
						break;
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
					case "get-id":
						log("new node id :" + msg.data);
						ws.id = openedSocketsCount;
						openedSocketsCount++;
						openSockets[ws.id] = ws;
						var assignIdMsg = { 'type': "assign-id", 'id': ws.id };
						sendMessage(assignIdMsg,ws.id);
						break;
				}
			} catch (e) {
				console.log('websockets - failed to parse message' + e);
			}
		});
		function log(msg) {
			// console.log(msg);
		}
		function sendMessage(msg, id) {
			console.log(msg);
			openSockets[id].send(JSON.stringify(msg));
		}

	});
	console.log("websockets server running on: " + port);
}

module.exports = webSocketModule;
