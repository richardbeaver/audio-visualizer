// Set up audio and canvas contexts

const audio = document.getElementById('audio');
const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
source.connect(audioContext.destination);

// ==============================

let hue = 0;

function draw() {
  // Slowly change hue over the HSL spectrum
  hue += 0.1;

  const bufferLength = analyser.frequencyBinCount;
  const frequencyData = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(frequencyData);

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / frequencyData.length) * 2.5;

  let x = 0;
  for (let i = 0; i < bufferLength; i += 1) {
    const value = frequencyData[i];
    const barHeight = (value / 255) * canvas.height;

    canvasContext.fillStyle = `hsl(${hue}, 100%, ${40 + (i / 2)}%)`; // Bars vary from darker to lighter
    canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }

  requestAnimationFrame(draw);
}

function start() {
  audio.play();
  draw();
}

// ==============================

// Listen for audio playback

audio.addEventListener('play', start);

audio.addEventListener('pause', () => {
  audioContext.suspend();
});

// Second event listener for play after pausing so that context resumes
audio.addEventListener('play', () => {
  audioContext.resume();
});
