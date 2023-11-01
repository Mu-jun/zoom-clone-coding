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

const server = http.createServer(app);

// Using Socket.IO
const io = SocketIO(server);

io.on('connection', (socket) => {
  socket.on('join_room', (roomName, done) => {
    console.log(roomName);
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcome');
  });
});

const listenHandler = () => console.log('Listening on http://localhost:3000');
server.listen(3000, listenHandler);
