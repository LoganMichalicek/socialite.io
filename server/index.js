const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require("socket.io");

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

const server = http.createServer(app);

// This wrapper also allows access to the client
const io = socketio(server);

io.on('connection', (socket) => {
  // Get total count of clients
  console.log("Number of connected clients:", io.engine.clientsCount);

  const id = socket.id;
  // console.log("Someone connected!:", socket.id);
  socket.emit('message', 'Welcome!');

  socket.on('message', (text) => {
    io.emit('message', text);
  });

  socket.on('disconnect', (reason) => {
    io.emit('message', 'Someone disconnected! ' + id);
  });
});


server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(3000, () => {
  console.log('Game server started on port 3000');
});