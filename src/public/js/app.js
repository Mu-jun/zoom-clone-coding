const socket = io();

/* const messageList = document.querySelector('ul');
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
