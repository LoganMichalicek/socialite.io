const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require("socket.io");

const app = express();

var players = {};

app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

const server = http.createServer(app);

// This wrapper also allows access to the client
const io = socketio(server);

io.on('connection', (socket) => {
  players[socket.id] = {
    x: 400,
    y: 300
  };
  socket.emit('playersData', players);
  // Get total count of clients
  console.log("Number of connected clients:", io.engine.clientsCount);

  socket.emit("init", players);

  socket.broadcast.emit('newPlayer', {position: players[socket.id], id: socket.id});

  socket.on('movement', (data) => {
    players[socket.id] = {
      x: data.x,
      y: data.y
    };
  })

  socket.on('message', (text) => {
    io.emit('message', text);
  });

  const gameLoopInterval = setInterval(() => {
    socket.emit('playersData', players);
  }, 200);

  socket.on('disconnect', (reason) => {
    clearInterval(gameLoopInterval);
    delete players[socket.id];
    socket.broadcast.emit('playerLeft', socket.id);
  });

});


server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(3000, () => {
  console.log('Game server started on port 3000');
});