(function(ext) {
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_temp = function(callback) {
       $.ajax({
              url: 'https://api.particle.io/v1/devices/22003f000747343232363230/sensorvalue?access_token=c3a30c3f90a8389756271293cbf2168e40b3b1c8',
              dataType: 'json',
              success: function( sensor_data ) { debugger;
                callback(sensor_data["result"])
              }
        });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'current sensor values'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('sensor test extension', descriptor, ext);
})({});