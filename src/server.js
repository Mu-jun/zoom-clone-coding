import http from 'http';
import SocketIO from 'socket.io';
import express from 'express';

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const server = http.createServer(app);

// Using Socket.IO
const io = SocketIO(server);

io.on('connection', (socket) => {
  socket.on('join_room', (roomName, socketId) => {
    socket.join(roomName);
    socket.emit('join_complete', socketId);
    socket.to(roomName).emit('welcome', socketId);
  });

  socket.on('msg', (targetId) => {
    socket.to(targetId).emit('msg', 'hi');
  });

  socket.on('offer', (offer, roomName, senderId) => {
    socket.to(roomName).emit('offer', offer, senderId);
  });

  socket.on('answer', (answer, roomName) => {
    socket.to(roomName).emit('answer', answer);
  });

  socket.on('ice', (ice, roomName) => {
    socket.to(roomName).emit('ice', ice);
  });
});

const listenHandler = () => console.log('Listening on http://localhost:3000');
server.listen(3000, listenHandler);
