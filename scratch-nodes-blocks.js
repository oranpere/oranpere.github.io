(function (ext) {
  var socket;
  ext.ligt_level = [];
  ext.button_status = [];
  ext.x_axis_value = [];
  ext.y_axis_value = [];
  ext.z_axis_value = [];
  ext.mic_value = [];
 

  var id;
  var defaultServerIP = "52.6.39.58";
  var closingChar = ';';
  function socketInit(ip, callback) {
    socket = new WebSocket("ws://" + ip + ":59553");
    socket.onmessage = onMessageHandler;
    socket.onopen = idSetup;
  }

  function idSetup() {
    id = 'scratchx-' + new Date().getTime();
    var msg = { 'type': 'set-id', 'data': id };
    sendMessage(msg);
  }

  socketInit(defaultServerIP);

  function onMessageHandler(event) {
    var msg;
    try {
      msg = JSON.parse(event.data);
      switch (msg.type) {
        case "light-level":
          ext.ligt_level[msg.node_id] = msg.data;
          break;
        case "button-state":
          ext.button_state[msg.node_id] = msg.data;
          break;
        case "x-axis-value":
          ext.x_axis_value[msg.node_id] = msg.data;
          break;
        case "y-axis-value":
          ext.y_axis_value[msg.node_id] = msg.data;
          break;
        case "z-axis-value":
          ext.z_axis_value[msg.node_id] = msg.data;
          break;
        case "mic-value":
          ext.mic_value[msg.node_id] = msg.data;
          break;
      }
    } catch (e) {
      console.log('websockets - failed to parse message');
    }
  }

  // Cleanup function when the extension is unloaded
  ext._shutdown = function () {
    socket.close();
  };

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function () {
    return { status: 2, msg: 'Ready' };
  };

  ext.get_btn_status = function (nodeId, callback) {
    return (valueOrDefault(ext.button_state[nodeId]));
  };

  ext.get_x_value = function (nodeId, callback) {
    return (valueOrDefault(ext.x_axis_value[nodeId]));
  };

  ext.get_y_value = function (nodeId, callback) {
    return (valueOrDefault(ext.y_axis_value[nodeId]));
  };

  ext.get_z_value = function (nodeId, callback) {
    return (valueOrDefault(ext.z_axis_value[nodeId]));
  };

  ext.get_mic_value = function (nodeId, callback) {
    return (valueOrDefault(ext.mic_value[nodeId]));
  };

  ext.get_light_level = function (nodeId, callback) {
    return (valueOrDefault(ext.ligt_level[nodeId]))
  };
  
  function valueOrDefault(sensorValue){
    if(typeof sensorValue === 'undefined')
     return "Not Available";
    return sensorValue;
  }

  ext.play_drum = function (drumId, deviceId, callback) {
    var msg = { 'type': 'play-drum', 'target_id': deviceId, 'drum_id': drumId };
    sendMessage(msg);
  };

  ext.set_led_rgb = function (ledId,nodeId, redVal, greenVal, blueVal ) {
    var msg = { 'type': 'set-led-rgb', 'target_id': nodeId, 'data': padWithZeros(redVal, 3) + padWithZeros(greenVal, 3) + padWithZeros(blueVal, 3) + padWithZeros(ledId, 2) + closingChar };
    sendMessage(msg);
  };

  ext.connect_to_server = function (ip) {
    defaultServerIP = ip;
    socketInit(ip);
    return true;
  }

  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      ['h', 'connect to server on: %s', 'connect_to_server', "localhost"],
      ['r', 'Button clicked in Node: %s', 'get_btn_status', "red"],
      ['r', 'Light of Node: %s', 'get_light_level', "red"],
      ['r', 'X Acceleration of Node: %s', 'get_x_axis_value', "red"],
      ['r', 'Y Acceleration of Node: %s', 'get_y_axis_value', "red"],
      ['r', 'Z Acceleration of Node: %s', 'get_z_axis_value', "red"],
      ['r', 'Microphone of Node: %s', 'get_mic_value', "red"],
      [' ', 'Set LED %m.ledNumber of Node %s  to color  Red:%s, Green:%s, Blue:%s', 'set_led_rgb', '0', 'red','10', '0', '0'],
      [' ', 'Play drum %n on node: %s', 'play_drum', 1, '1'],
    ],
    menus: {
        ledNumber: ['0', '1', '2','3','4','5','6','7','8','9','10','11','12','13','14','15']
    }
  };

  function sendMessage(msg) {
    if (socket.readyState != 1) {
      socketInit(defaultServerIP);
    }
    socket.send(JSON.stringify(msg));
  }

  function padWithZeros(color, numberOfZeros) {
    while (color.length < numberOfZeros) {
      color = '0' + color;
    }
    return color;
  }

  // Register the extension
  ScratchExtensions.register('button statues', descriptor, ext);
})({});
