'use strict';

var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('A new user connected!');

  socket.on('logEvent', function (data) {
    io.emit('persistEvent', data);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
