(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_btn_status = function(callback) {
       $.ajax({
              url: 'https://api.particle.io/v1/devices/53ff6e066667574818232067/isclicked?access_token=4007a7e4e0dfa5f11e7777101f4ff245e631dcc0',
              dataType: 'json',
              success: function( sensor_data ) { debugger;
                callback(sensor_data["result"])
              }
        });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'current button status', 'get_btn_status'],
        ]   
    };

    // Register the extension
    ScratchExtensions.register('button statues', descriptor, ext);
})({});