(function (ext) {
  var socket;
  socketInit("localhost");
  var id;
  var date = new Date();
  var lastGetLightLvlClock = date.getTime();
  
  function socketInit(ip, callback) {
    socket = new WebSocket("ws://" + ip + ":8080");
    socket.onmessage = onMessageHandler;
    socket.onopen = idSetup;
  }

  function idSetup() {

    id = 'scratchx-' + date.getTime();
    var msg = { 'type': 'set-id', 'data': id };
    sendMessage(msg);
    if (typeof ext.connect_to_server_callback !== 'undefined') {
      ext.connect_to_server_callback("great success!");
    }
  }

  function onMessageHandler(event) {
    var msg;
    try {
      msg = JSON.parse(event.data);
      switch (msg.type) {
        case "light-level":
          if (ext.ligt_level_callback)
            ext.ligt_level_callback(msg.data);
          break;
        case "button-state":
          if (ext.ligt_level_callback)
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

  ext.get_btn_status = function (callback) {
    var msg = { 'type': 'get-button-state', 'target_id': id };
    sendMessage(msg);
    ext.button_state_callback = callback;
  };

  ext.set_led_off = function (callback) {
    var msg = { 'type': 'turn-led-off', 'target_id': '1' };
    sendMessage(msg);
  };


  ext.set_led_on = function (callback) {
    var msg = { 'type': 'turn-led-on', 'target_id': '1' };
    sendMessage(msg);
  };

  ext.get_light_level = function (callback) {
    //50 frames per sec or less
    if (date.getTime() - lastGetLightLvlClock < 20)
      return;
      
    lastGetLightLvlClock = date.getTime();
    var msg = { 'type': 'get-light-level', 'target_id': id };
    sendMessage(msg);
    ext.ligt_level_callback = callback;
  };

  ext.play_drum = function (drumId, deviceId, callback) {
    var msg = { 'type': 'play-drum', 'target_id': deviceId, 'drum_id': drumId };
    sendMessage(msg);
  };

  ext.connect_to_server = function (ip, callback) {
    ext.connect_to_server_callback = callback;
    socketInit(ip);
  }

  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      ['R', 'current button status', 'get_btn_status'],
      [' ', 'Turn off led on node: %s', 'set_led_off', 1],
      [' ', 'Turn on led on node: %s', 'set_led_on', 1],
      [' ', 'Play drum %n on device %n', 'play_drum', 1, 1],
      [' ', 'connect to server on: %s', 'connect_to_server', "localhost"],
      ['R', 'get light', 'get_light_level'],
    ]
  };

  function sendMessage(msg) {
    if (socket.readyState != 1) {
      socketInit();
    }
    socket.send(JSON.stringify(msg));
  }

  // Register the extension
  ScratchExtensions.register('button statues', descriptor, ext);
})({});
