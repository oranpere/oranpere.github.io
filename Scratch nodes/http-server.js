// Copyright (C) 2015 Massachusetts Institute of Technology
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 2,
// as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

// Oran Peretz 2015
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