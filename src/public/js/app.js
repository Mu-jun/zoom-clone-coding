const call = document.getElementById('call');
const myFace = document.getElementById('myFace');

const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');
const socket = io();

let myStream;
let muteFlag = false;
let cameraFlag = true;
let roomName;
let myPeerConnection;

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
function handleCameraChange() {
  getUserMedia(camerasSelect.value);
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
  makeConnection();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector('input');
  roomName = input.value;
  await initCall();
  socket.emit('join_room', roomName);
  input.value = '';
}

welcomeForm.addEventListener('submit', handleWelcomeSubmit);

// socket event

socket.on('welcome', async () => {
  const offer = await myPeerConnection.createOffer();
  await myPeerConnection.setLocalDescription(offer);
  console.log('sent the offer');
  socket.emit('offer', offer, roomName);
});

socket.on('offer', async (offer) => {
  console.log('received the offer');
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  await myPeerConnection.setLocalDescription(answer);
  console.log('sent the answer');
  socket.emit('answer', answer, roomName);
});

socket.on('answer', (answer) => {
  console.log('received the answer');
  myPeerConnection.setRemoteDescription(answer);
});

socket.on('ice', (ice) => {
  console.log('received the IceCandidate');
  myPeerConnection.addIceCandidate(ice);
});

// RTC code

function handleIce(data) {
  console.log('got a my IceCandidate');
  socket.emit('ice', data.candidate, roomName);
}

async function handleAddStream(data) {
  const peerFace = document.getElementById('peerFace');
  const [remoteStream] = data.streams;
  console.log('remoteStream : ', remoteStream);
  console.log('myStream : ', myStream);
  peerFace.srcObject = remoteStream;
}

function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myPeerConnection.addEventListener('icecandidate', handleIce);
  myPeerConnection.addEventListener('track', handleAddStream);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
