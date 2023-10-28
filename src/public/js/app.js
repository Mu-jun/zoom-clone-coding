const home = document.querySelector('#home');
const form = home.querySelector('form');

const room = document.querySelector('#room');

const socket = io();
function addMessage(message) {
  const li = document.createElement('li');
  li.innerText = message;
  const ul = room.querySelector('ul');
  ul.appendChild(li);
}

const showRoom = (roomName) => {
  home.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = 'Room name : ' + roomName;
};
const handleSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
};
form.addEventListener('submit', handleSubmit);

socket.on('welcome', () => {
  addMessage('Someone joined!');
});

/* Using WebSocket
const messageList = document.querySelector('ul');
const nicknameForm = document.querySelector('form#nick');
const messageForm = document.querySelector('form#msg');

const socket = new WebSocket(`ws://${window.location.host}`);

const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

socket.addEventListener('open', () => {
  console.log('Connect to the Server');
});

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener('close', () => {
  console.log('Disconneted from the Server');
});

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
};
nicknameForm.addEventListener('submit', handleNickSubmit);

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('message', input.value));
  input.value = '';
};
messageForm.addEventListener('submit', handleSubmit);
 */
