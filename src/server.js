import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const listenHandler = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // 매개변수 없어도 됨.

const sockets = [];

wss.on('connection', (socket) => {
  sockets.push(socket);
  console.log('Connect to the Browser');
  socket.on('message', (data) => {
    sockets.forEach((aSocket) => aSocket.send(data.toString('utf8')));
  });
  socket.on('close', () => {
    console.log('Disconneted from the Browser');
  });
});

server.listen(3000, listenHandler);
