const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log('Connect to the Server');
});

socket.addEventListener('message', (message) => {
  console.log('New message: ', message.data);
});

socket.addEventListener('close', () => {
  console.log('Disconneted from the Server');
});

setTimeout(() => {
  socket.send('hello wss~');
}, 3000);
