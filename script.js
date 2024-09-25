const BLOW_THRESHOLD = 150; // Adjust this value to detect blowing
const NUMBER_OF_CANDLES = 5; // Total number of candles

const video = document.getElementById('video');
// Function to create multiple candles with different colors
function createCandles() {
  const container = document.getElementById('candles-container');
  const colors = ['#f7cac9', '#92a8d1', '#ffeb99', '#bada55', '#ff5733']; // Different candle colors
  
  for (let i = 0; i < 5; i++) {
      const candle = document.createElement('div');
      candle.classList.add('candle');
      candle.style.backgroundColor = colors[i]; // Set different candle colors

      const flame = document.createElement('div');
      flame.classList.add('flame');
      flame.setAttribute('id', `flame${i}`);

      const wick = document.createElement('div');
      wick.classList.add('wick');

      candle.appendChild(flame);
      candle.appendChild(wick);
      container.appendChild(candle);
  }
}

// Function to access and process the microphone input
async function getMicrophoneInput() {
  try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const input = audioContext.createMediaStreamSource(stream);

      // Create an analyser node to process audio data
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Smaller FFT size for more responsive analysis

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      input.connect(analyser);

      // Function to check the microphone input
      function detectBlow() {
          analyser.getByteFrequencyData(dataArray);

          // Calculate average volume from the frequency data
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
          }
          const avgVolume = sum / dataArray.length;

          // Set a threshold for blowing (adjust as needed)
          if (avgVolume > BLOW_THRESHOLD) { // Adjust this value to detect blowing
              console.log('Blow detected!');
              randomlyPutOutCandles(); // Randomly put out candles when blowing
          }
      }

      // Continuously check the audio input
      function listen() {
          detectBlow();
          requestAnimationFrame(listen);
      }
      listen();

  } catch (err) {
      console.error('Microphone access denied or error:', err);
  }
}

// Function to randomly put out one or more candles
function randomlyPutOutCandles() {
  const numberOfCandles = NUMBER_OF_CANDLES; // Total number of candles
  const randomIndex = Math.floor(Math.random() * numberOfCandles); // Randomly select a candle
  
  const flame = document.getElementById(`flame${randomIndex}`);
  if (flame) {
      flame.style.display = 'none'; // Hide the randomly selected candle's flame
  }

  // You can also put out multiple random candles
  const randomIndex2 = Math.floor(Math.random() * numberOfCandles);
  if (randomIndex2 !== randomIndex) {
      const flame2 = document.getElementById(`flame${randomIndex2}`);
      if (flame2) {
          flame2.style.display = 'none';
      }
  }
}

// Create candles and start listening for microphone input
createCandles();
video.play();
function triggerAfterVideoIsPlayed() {
  const clue = document.getElementsByClassName('clue');
  clue.classList.remove('hidden');
  getMicrophoneInput();
}


video.addEventListener('ended', triggerAfterVideoIsPlayed);
