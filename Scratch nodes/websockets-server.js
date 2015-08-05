var webSocketModule = function (messenger, port) {
	var WebSocketServer = require('ws').Server
		, wss = new WebSocketServer({ port: port });
	var openSockets = [];
	
	wss.on('connection', function connection(ws) {
		ws.on('message', function incoming(message) {
			console.log(message);
			var msg;
			try {
				msg = JSON.parse(message);
				switch (msg.type) {
					case "turn-led-on":
						log('turning leds on');
						messenger.sendLedChangeMessage(new Buffer('1'));
						break;
					case "turn-led-off":
						messenger.sendLedChangeMessage(new Buffer('0'));
						log('turning leds off');
						break;
					case "get-light-level":

						if (messenger.lightLevelMsg == "")
							return;
						sendMessage(messenger.lightLevelMsg, msg.target_id);
						log('getting light level');
						break;
					case "get-button-state":
						if (messenger.buttonStateMsg == "")
							return;
						sendMessage(messenger.buttonStateMsg, msg.target_id);
						log('turning leds off');
						break;
					case "play-drum":
						var drumMsg = { 'type': "play-drum", 'drum_id': msg.drum_id };
						sendMessage(drumMsg, msg.target_id);
						log('playing drum');
						break;
					case "set-id":
						log("new node id :" + msg.data);
						ws.id = msg.data.toString();
						openSockets[ws.id] = ws;
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
