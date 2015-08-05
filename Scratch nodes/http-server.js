var httpServerModule = function (httpServerPort) {

  var express = require('express');
  var server = express();
  var cors = require('cors');
  server.use(cors());
  server.use(express.static('public'));

  var httpServer = server.listen(httpServerPort, function () {
    var host = httpServer.address().address;
    var port = httpServer.address().port;

    console.log('http server listening at http://%s:%s', host, port);
  });
}

module.exports = httpServerModule;