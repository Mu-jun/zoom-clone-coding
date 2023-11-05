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
let myPeerConnections = new Map();
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
  if (myPeerConnections.size > 0) {
    const videoTrack = myStream.getVideoTracks()[0];
    myPeerConnections.forEach((pc) => {
      const videoSender = pc
        .getSenders()
        .find((sender) => sender.track.kind === 'video');
      videoSender.replaceTrack(videoTrack);
    });
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

socket.on('welcome', async (newSocketId) => {
  console.log(`${newSocketId} joined!`);
  const pc = makeConnection(newSocketId);
  const dc = pc.createDataChannel('chat');
  dc.addEventListener('message', handleRTCMessage);
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  myPeerConnections.set(newSocketId, pc);
  myDataChannels.set(newSocketId, dc);

  console.log('sent the offer');
  socket.emit('offer', offer, newSocketId, socket.id);
});

socket.on('offer', async (offer, senderId) => {
  const pc = makeConnection(senderId);
  myPeerConnections.set(senderId, pc);

  console.log('received the offer');
  pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  console.log('sent the answer');
  socket.emit('answer', answer, senderId, socket.id);
});

socket.on('answer', (answer, senderId) => {
  console.log('received the answer');
  const pc = myPeerConnections.get(senderId);
  pc.setRemoteDescription(answer);
});

socket.on('ice', (ice, senderId) => {
  console.log('received the IceCandidate');
  const pc = myPeerConnections.get(senderId);
  pc.addIceCandidate(ice);
});

// RTC code

function makeConnection(targetId) {
  function handleIce(data) {
    console.log('got a my IceCandidate');
    socket.emit('ice', data.candidate, targetId, socket.id);
  }
  /*
   * track 이벤트는 audio, video로 2번 발생하나
   * 어떤 스트림을 연결하여도 비디오, 오디오 모두 정상 작동한다.
   * 2번 발생하는 것을 이해하는데 스트림 상관없이 모두 정상 작동하는 것은
   * why?
   */
  function handleAddStream(data) {
    const peerFaces = document.getElementById('peerFaces');
    if (data.track.kind === 'video') {
      const peerFace = document.createElement('video');
      peerFace.setAttribute('id', targetId);
      peerFace.setAttribute('autoplay', '');
      peerFace.setAttribute('playsinline', '');
      peerFace.setAttribute('width', '200');
      peerFace.setAttribute('height', '200');
      const [remoteStream] = data.streams;
      peerFace.srcObject = remoteStream;
      peerFaces.appendChild(peerFace);
    }
  }

  function handleAddDataChannel(event) {
    const dc = event.channel;
    dc.addEventListener('message', handleRTCMessage);
    dc.addEventListener('open', () => {
      const msg = `${targetId} 님이 들어오셨습니다.`;
      dc.send(msg);
    });
    myDataChannels.set(targetId, dc);

    addMessage(`${roomName} 방에 들어왔습니다.`);
  }

  function handleDisconnect(event) {
    const pc = event.target;
    if (pc.connectionState === 'disconnected') {
      addMessage(`${targetId} 님이 나가셨습니다.`);
      const video = document.querySelector(`video#${targetId}`);
      video.remove();
      myPeerConnections.delete(targetId);
      myDataChannels.delete(targetId);
    }
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
  pc.addEventListener('connectionstatechange', handleDisconnect);
  myStream.getTracks().forEach((track) => pc.addTrack(track, myStream));
  return pc;
}
