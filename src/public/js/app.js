const myFace = document.getElementById('myFace');

const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');

const socket = io();

let myStream;
let muteFlag = false;
let cameraFlag = true;

async function getUserMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myFace.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}

getUserMedia();

function handleMuteClick() {
  if (muteFlag) {
    muteFlag = false;
    muteBtn.innerText = 'Mute';
  } else {
    muteFlag = true;
    muteBtn.innerText = 'Unmute';
  }
}
function handleCameraClick() {
  if (cameraFlag) {
    cameraFlag = false;
    cameraBtn.innerText = 'Camera On';
  } else {
    cameraFlag = true;
    cameraBtn.innerText = 'Camera Off';
  }
}
muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);

