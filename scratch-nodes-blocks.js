(function (ext) {
  var socket;
  socketInit("localhost");
  var id;
  var defaultServerIP = "localhost";

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
          if (!(typeof ext.ligt_level_callback === 'function'))
            return;
          ext.ligt_level_callback(msg.data);
          break;
        case "button-state":
          if (!(typeof ext.button_state_callback === 'function'))
            return;
          ext.button_state_callback(msg.data);
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
    var msg = { 'type': 'get-button-state', 'target_id': id, 'particle_id': particleId };
    sendMessage(msg);
    ext.button_state_callback = callback;
    setTimeout(function(){ ext.button_state_callback("null"); ext.button_state_callback = {}; }, 2000);
  };

  ext.set_led_off = function (particleId, callback) {
    var msg = { 'type': 'turn-led-off', 'target_id': particleId };
    sendMessage(msg);
  };


  ext.set_led_on = function (particleId, callback) {
    var msg = { 'type': 'turn-led-on', 'target_id': particleId };
    sendMessage(msg);
  };

  ext.get_light_level = function (particleId, callback) {
    var msg = { 'type': 'get-light-level', 'target_id': id, 'particle_id': particleId };
    sendMessage(msg);
    ext.ligt_level_callback = callback;
    setTimeout(function(){ ext.ligt_level_callback("null"); ext.ligt_level_callback = {}; }, 2000);
  };

  ext.play_drum = function (drumId, deviceId, callback) {
    var msg = { 'type': 'play-drum', 'target_id': deviceId, 'drum_id': drumId };
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
      ['R', 'current button status from node: %s', 'get_btn_status', "p1"],
      [' ', 'Turn off led on node: %s', 'set_led_off', 'p1'],
      [' ', 'Turn on led on node: %s', 'set_led_on', 'p1'],
      [' ', 'Play drum %n on node: %s', 'play_drum', 1, '1'],
      ['h', 'connect to server on: %s', 'connect_to_server', "localhost"],
      ['R', 'get light from node: %s', 'get_light_level', "p1"],
    ]
  };

  function sendMessage(msg) {
    if (socket.readyState != 1) {
      socketInit(defaultServerIP);
    }
    socket.send(JSON.stringify(msg));
  }

  // Register the extension
  ScratchExtensions.register('button statues', descriptor, ext);
})({});
