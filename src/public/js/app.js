const call = document.getElementById('call');
const myFace = document.getElementById('myFace');

const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

const chat = document.getElementById('chat');
const chatForm = chat.querySelector('form');

const socket = io();

let myStream;
let muteFlag = false;
let cameraFlag = true;
let roomName;
let myPeerConnections = {};
let myDataChannels = new Map();

async function getCameras() {
  try {
    const media = await navigator.mediaDevices.enumerateDevices();
    const cameras = media.filter((device) => device.kind === 'videoinput');
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      const currentCamera = myStream.getVideoTracks()[0];
      if (currentCamera == camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getUserMedia(deviceId) {
  const constraints = {
    audio: true,
    video: { facingMode: 'user' },
  };
  if (deviceId) {
    constraints.video = {
      deviceId: {
        exact: deviceId,
      },
    };
  }
  try {
    myStream = await navigator.mediaDevices.getUserMedia(constraints);
    myFace.srcObject = myStream;
    if (!deviceId) await getCameras();
  } catch (e) {
    console.log(e);
  }
}

function handleMuteClick() {
  myStream.getAudioTracks().forEach((audio) => (audio.enabled = muteFlag));
  if (muteFlag) {
    muteFlag = false;
    muteBtn.innerText = 'Mute';
  } else {
    muteFlag = true;
    muteBtn.innerText = 'Unmute';
  }
}
function handleCameraClick() {
  myStream.getVideoTracks().forEach((video) => (video.enabled = !cameraFlag));
  if (cameraFlag) {
    cameraFlag = false;
    cameraBtn.innerText = 'Camera On';
  } else {
    cameraFlag = true;
    cameraBtn.innerText = 'Camera Off';
  }
}
async function handleCameraChange() {
  await getUserMedia(camerasSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === 'video');
    videoSender.replaceTrack(videoTrack);
  }
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('change', handleCameraChange);

// Welcome Form (join a room)

const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('form');

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getUserMedia();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector('input');
  roomName = input.value;
  await initCall();
  socket.emit('join_room', roomName, socket.id);
  input.value = '';
}

welcomeForm.addEventListener('submit', handleWelcomeSubmit);

function addMessage(message) {
  const ul = chat.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleChatsubmit(evnet) {
  event.preventDefault();
  const input = chatForm.querySelector('input');
  const message = input.value;
  input.value = '';
  myDataChannels.forEach((dc) => dc.send(message));
  addMessage(`You : ${message}`);
}
chatForm.addEventListener('submit', handleChatsubmit);

// socket event

function handleRTCMessage(event) {
  const message = event.data;
  addMessage(message);
}

socket.on('join_complete', (socketId) => {
  mySoketId = socketId;
});

socket.on('welcome', async (newSocketId) => {
  console.log(`${newSocketId} joined!`);
  const pc = makeConnection(newSocketId);
  const dc = pc.createDataChannel('chat');
  dc.addEventListener('message', handleRTCMessage);
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  myPeerConnections[newSocketId] = pc;
  myDataChannels.set(newSocketId, dc);

  console.log('sent the offer');
  socket.emit('offer', offer, newSocketId, socket.id);
});

socket.on('offer', async (offer, senderId) => {
  const pc = makeConnection(senderId);
  myPeerConnections[senderId] = pc;

  console.log('received the offer');
  pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  console.log('sent the answer');
  socket.emit('answer', answer, senderId, socket.id);
});

socket.on('answer', (answer, senderId) => {
  console.log('received the answer');
  const pc = myPeerConnections[senderId];
  pc.setRemoteDescription(answer);
});

socket.on('ice', (ice, senderId) => {
  console.log('received the IceCandidate');
  const pc = myPeerConnections[senderId];
  pc.addIceCandidate(ice);
});

// RTC code

function makeConnection(targetId) {
  function handleIce(data) {
    console.log('got a my IceCandidate');
    socket.emit('ice', data.candidate, targetId, socket.id);
  }

  function handleAddStream(data) {
    const peerFace = document.getElementById('peerFace');
    const [remoteStream] = data.streams;
    peerFace.srcObject = remoteStream;
  }

  function handleAddDataChannel(event) {
    const dc = event.channel;
    dc.addEventListener('message', handleRTCMessage);
    dc.addEventListener('close', console.log);
    myDataChannels.set(targetId, dc);

    addMessage(`${roomName} 방에 들어왔습니다.`);
  }
  // 아래 STUN 서버는 구글에서 개발 및 테스트를 위해 제공하는 무료서버이므로
  // 실제 product에서는 사용x
  // xirsys 등 STUN 서버 제공 서비스 검색 ㄱㄱ
  const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
  };
  const pc = new RTCPeerConnection(configuration);
  pc.addEventListener('icecandidate', handleIce);
  pc.addEventListener('track', handleAddStream);
  pc.addEventListener('datachannel', handleAddDataChannel);
  myStream.getTracks().forEach((track) => pc.addTrack(track, myStream));
  return pc;
}
