(function (ext) {
  var socket;
  ext.ligt_level = "Not Available";
  ext.button_status = "Not Available";
  ext.x_axis_value = "Not Available";
  ext.y_axis_value = "Not Available";
  ext.z_axis_value = "Not Available";
  ext.mic_value = "Not Available";

  socketInit("localhost");
  var id;
  var defaultServerIP = "localhost";
  var closingChar = ';';
  function socketInit(ip, callback) {
    socket = new WebSocket("ws://" + ip + ":8080");
    socket.onmessage = onMessageHandler;
    socket.onopen = idSetup;
  }

  function idSetup() {
    id = 'scratchx-' + new Date().getTime();
    var msg = { 'type': 'set-id', 'data': id };
    sendMessage(msg);
  }

  function onMessageHandler(event) {
    var msg;
    try {
      msg = JSON.parse(event.data);
      switch (msg.type) {
        case "light-level":
          ext.ligt_level = msg.data;
          break;
        case "button-state":
          ext.button_state = msg.data;
          break;
        case "x-axis-value":
          ext.x_axis_value = msg.data;
          break;
        case "y-axis-value":
          ext.y_axis_value = msg.data;
          break;
        case "z-axis-value":
          ext.z_axis_value = msg.data;
          break;
        case "mic-value":
          ext.mic_value = msg.data;
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

  ext.get_btn_status = function (particleId, callback) {
    callback(ext.button_state);
  };
  
  ext.get_x_value = function (particleId, callback) {
    callback(ext.x_axis_value);
  };
  
  ext.get_y_value = function (particleId, callback) {
    callback(ext.y_axis_value);
  };

  ext.get_z_value = function (particleId, callback) {
    callback(ext.z_axis_value);
  };
  
  ext.get_mic_value = function (particleId, callback) {
    callback(ext.mic_value);
  };

  ext.get_light_level = function (particleId, callback) {
    callback(ext.ligt_level)
  };

  ext.play_drum = function (drumId, deviceId, callback) {
    var msg = { 'type': 'play-drum', 'target_id': deviceId, 'drum_id': drumId };
    sendMessage(msg);
  };

  ext.set_led_rgb = function (ledId, redVal, greenVal, blueVal, nodeId) {
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
      ['R', 'current button status from node: %s', 'get_btn_status', "red"],
      ['R', 'current X axis value from node: %s', 'get_x_axis_value', "red"],
      ['R', 'current y axis value from node: %s', 'get_y_axis_value', "red"],
      ['R', 'current z axis value from node: %s', 'get_z_axis_value', "red"],
      ['R', 'current mic value from node: %s', 'get_mic_value', "red"],
      [' ', 'set led %s, red:%s, green:%s, blue:%s, on node: %s', 'set_led_rgb', '0', '10', '0', '0', 'red'],
      [' ', 'Play drum %n on node: %s', 'play_drum', 1, '1'],
      ['h', 'connect to server on: %s', 'connect_to_server', "localhost"],
      ['R', 'get light from node: %s', 'get_light_level', "red"],
    ]
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
