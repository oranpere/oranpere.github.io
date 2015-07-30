var dgram = require("dgram");
var fs = require('fs');
var server = dgram.createSocket("udp4");
var lightlevel ;
server.on("message", function (msg, rinfo) {
lightlevel = msg;
});
server.on("listening", function () {
  var address = server.address();
  
  console.log("server listening " + address.address + ":" + address.port);
});
server.bind(3333);


var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
app.get('/', function (req, res) {
  res.send("1");
 
});

var server = app.listen(59552, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});