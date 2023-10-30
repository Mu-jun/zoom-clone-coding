const nick = document.querySelector('#nickname');
const nickForm = nick.querySelector('form');
let nickname;

const home = document.querySelector('#home');
const msgForm = home.querySelector('form');

const room = document.querySelector('#room');
let roomName;

const socket = io();
function addMessage(message) {
  const li = document.createElement('li');
  li.innerText = message;
  const ul = room.querySelector('ul');
  ul.appendChild(li);
}

const showNickname = () => {
  const h3 = nick.querySelector('h3');
  h3.innerText = 'My Nickname : ' + nickname;
};
const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  nickname = input.value;
  socket.emit('nickname', nickname, showNickname);
  input.value = '';
};
nickForm.addEventListener('submit', handleNickSubmit);

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
  const input = msgForm.querySelector('input');
  roomName = input.value;
  socket.emit('enter_room', roomName, showRoom);
};
msgForm.addEventListener('submit', handleSubmit);

socket.on('welcome', (nickname, userCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room name : ${roomName} (${userCount})`;
  addMessage(`${nickname} joined!`);
});

socket.on('bye', (nickname, userCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room name : ${roomName} (${userCount})`;
  addMessage(`${nickname} left TT`);
});

socket.on('new_message', addMessage);

socket.on('rooms_change', (rooms) => {
  const ul = document.querySelector('ul#roomList');
  ul.innerText = '';
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    ul.append(li);
  });
});
