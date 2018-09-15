'use strict';

//const express = require('express');
//const app = express();
const tcp_routes = require('../tcp/tcp');
const compression = require('compression');

const Net = require('net');
const port = 8080;

const app = new Net.Server();

app.listen(port, () => {
  console.log(`Server listening for connection requests on socket localhost:${port} at
      ${new Date(Date.now())}.`);
});

app.on('connection', socket => {
  console.log('new connection');

  socket.write('Hello');

  socket.on('data', chunk => {
    console.log(`Data received from client: ${chunk.toString()}.`);
  });

  socket.on('end', function () {
    console.log('Closing connection with the client');
  });

  socket.on('error', function (err) {
    console.log(`Error: ${err}`);
  });
});

module.exports = app;
//# sourceMappingURL=server.js.map