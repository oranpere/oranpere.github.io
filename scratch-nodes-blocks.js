(function (ext) {
  var socket;
  socketInit();
  var id = 1;
  
  function socketInit() {
    socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = onMessageHandler;
    socket.readyState = 1;
    var date = new Date();
    id = date.getTime();
    var msg = { 'type': 'set-id', 'data': 'scratchx-' + id };
    sendMessage(msg);
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
    var msg = { 'type': 'get-light-level', 'target_id': id };
    sendMessage(msg);
    ext.ligt_level_callback = callback;
  };

  ext.play_drum = function (callback) {
    var msg = { 'type': 'play-drum', 'target_id': '1' };
    sendMessage(msg);
  };

  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      ['R', 'current button status', 'get_btn_status'],
      [' ', 'Turn off led', 'set_led_off'],
      [' ', 'Turn on led', 'set_led_on'],
      [' ', 'Play drum', 'play_drum'],
      ['R', 'get light', 'get_light_level'],
    ]
  };

  function sendMessage (msg) {
    // if (socket.readyState != 1) {
    //   socket = new WebSocket("ws://localhost:8080");
    //   socketInit();
    // }
    socket.send(JSON.stringify(msg));
  }

  // Register the extension
  ScratchExtensions.register('button statues', descriptor, ext);
})({});
