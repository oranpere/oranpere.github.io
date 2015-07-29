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
              success: function( sensor_data ) { 
                callback(sensor_data["result"])
              }
        });
    };

      var buildChangeLedRequest = function(args){
         return {
                  "async": true,
                  "crossDomain": true,
                  "url": "https://api.particle.io/v1/devices/53ff6e066667574818232067/changeled",
                  "method": "POST",
                  "headers": {},
                  "data": {
                    "access_token": "4007a7e4e0dfa5f11e7777101f4ff245e631dcc0",
                    "args": args
                      }
                    };
        }

    ext.set_led_off = function(callback) {
        $.ajax(buildChangeLedRequest("off")).done(function (response) {
           if(response.return_value == 1)
              callback("turned off led");
        });        
     };
     
     
    ext.set_led_on = function(callback) {
        $.ajax(buildChangeLedRequest("on")).done(function (response) {
           if(response.return_value == 1)
              callback("turned on led");
        });        
     };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'current button status', 'get_btn_status'],
            ['h', 'Turn off led', 'set_led_off'],
            ['h', 'Turn on led', 'set_led_on'],
        ]   
    };

    // Register the extension
    ScratchExtensions.register('button statues', descriptor, ext);
})({});