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
    socket.to(roomName).emit('welcome', socketId);
  });

  socket.on('offer', (offer, targetId, senderId) => {
    socket.to(targetId).emit('offer', offer, senderId);
  });

  socket.on('answer', (answer, targetId, senderId) => {
    socket.to(targetId).emit('answer', answer, senderId);
  });

  socket.on('ice', (ice, targetId, senderId) => {
    socket.to(targetId).emit('ice', ice, senderId);
  });
});

const listenHandler = () => console.log('Listening on http://localhost:3000');
server.listen(3000, listenHandler);
