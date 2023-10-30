import http from 'http';
import WebSocket from 'ws';
import SocketIO from 'socket.io';
import express from 'express';
import { eventNames } from 'process';

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const listenHandler = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);

// Using Socket.IO
const io = SocketIO(server);

function getPublicRooms() {
  const adapter = io.sockets.adapter;
  const rooms = adapter.rooms;
  const sids = adapter.sids;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

io.on('connection', (socket) => {
  socket['nickname'] = 'Anonymous';
  socket.onAny((eventName) => {
    console.log('Socket event :', eventName);
  });

  socket.on('enter_room', (roomName, showRoom) => {
    socket.join(roomName);
    showRoom(roomName);
    socket.to(roomName).emit('welcome', socket.nickname);
    io.emit('rooms_change', getPublicRooms());
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((roomName) => {
      socket.to(roomName).emit('bye', socket.nickname);
    });
  });

  socket.on('disconnect', () => {
    io.emit('rooms_change', getPublicRooms());
  });

  socket.on('new_message', (msg, roomName, done) => {
    socket.to(roomName).emit('new_message', `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on('nickname', (nickname, done) => {
    socket['nickname'] = nickname;
    done();
  });
});

/* Using WebSocket
const wss = new WebSocket.Server({ server }); // 매개변수 없어도 됨.
const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  socket.on('message', (data) => {
    const socketMessage = JSON.parse(data.toString('utf8'));
    switch (socketMessage.type) {
      case 'nickname':
        socket['nickname'] = socketMessage.payload;
        break;
      case 'message':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${socketMessage.payload}`)
        );
    }
  });
  socket.on('close', () => {
    console.log(`Disconneted from the ${socket.nickname}`);
  });
  console.log('Connect to the Browser');
}); */

server.listen(3000, listenHandler);
