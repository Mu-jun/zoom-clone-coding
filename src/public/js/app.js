const home = document.querySelector('#home');
const form = home.querySelector('form');

const room = document.querySelector('#room');
let roomName;

const socket = io();
function addMessage(message) {
  const li = document.createElement('li');
  li.innerText = message;
  const ul = room.querySelector('ul');
  ul.appendChild(li);
}

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('input');
  const msg = input.value;
  socket.emit('new_message', msg, roomName, () => {
    addMessage(`You : ${msg}`);
  });
  input.value = '';
};

const showRoom = () => {
  home.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = 'Room name : ' + roomName;
  const form = room.querySelector('form');
  form.addEventListener('submit', handleMessageSubmit);
};
const handleSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  roomName = input.value;
  socket.emit('enter_room', roomName, showRoom);
};
form.addEventListener('submit', handleSubmit);

socket.on('welcome', () => {
  addMessage('Someone joined!');
});

socket.on('bye', () => {
  addMessage('Someone left TT');
});

socket.on('new_message', addMessage);
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
