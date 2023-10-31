const myFace = document.getElementById('myFace');

const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');
const socket = io();

let myStream;
let muteFlag = false;
let cameraFlag = true;

async function getCameras() {
  try {
    const media = await navigator.mediaDevices.enumerateDevices();
    const cameras = media.filter((device) => device.kind === 'videoinput');
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    });
    console.log(cameras);
  } catch (e) {
    console.log(e);
  }
}

async function getUserMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myFace.srcObject = myStream;
    await getCameras();
  } catch (e) {
    console.log(e);
  }
}

getUserMedia();

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
muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
