const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require("socket.io");

const app = express();

const clientPath = path.resolve(__dirname, '../client');

console.log(`Serving static files from ${clientPath}`);
app.use(express.static(clientPath));

const server = http.createServer(app);

// This wrapper also allows access to the client
const io = socketio(server);

io.on('connection', (socket) => {
  console.log("Someone connected");
  socket.emit('message', 'Hello there!');

  socket.on('message', (text) => {
    io.emit('message', text);
  })
});

server.on('error', (err) => {
  console.lerror('Server error:', err);
});

server.listen(3000, () => {
  console.log('RPS started on port 3000');
});