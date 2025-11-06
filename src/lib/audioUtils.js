/**
 * Utility to generate a test audio file
 * This creates a simple silent MP3 audio track for testing purposes
 */

export async function generateTestAudio() {
  // Create a simple AudioContext tone
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 9; // 9 seconds to match subtitles
  
  const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * duration,
    audioContext.sampleRate
  );
  
  const data = buffer.getChannelData(0);
  
  // Create a simple sine wave pattern (soft beeping)
  const sampleRate = audioContext.sampleRate;
  const frequency = 440; // A4 note
  
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    // Create a quiet sine wave with amplitude envelope
    const envelope = Math.sin((t / duration) * Math.PI); // Fade in and out
    data[i] = Math.sin(2 * Math.PI * frequency * t) * 0.1 * envelope;
  }
  
  // Convert to WAV blob
  const WAV = encodeWAV(buffer);
  const blob = new Blob([WAV], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

function encodeWAV(audioBuffer) {
  const length = audioBuffer.length * audioBuffer.numberOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  const channels = [];
  let offset = 0;
  let pos = 0;

  // Write WAV header
  const setUint16 = (data) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };
  const setUint32 = (data) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  // "RIFF" chunk descriptor
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  // "fmt " sub-chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // chunkSize
  setUint16(1); // audioFormat (1 = PCM)
  setUint16(audioBuffer.numberOfChannels);
  setUint32(audioBuffer.sampleRate);
  setUint32(audioBuffer.sampleRate * 2 * audioBuffer.numberOfChannels); // avgByteRate
  setUint16(audioBuffer.numberOfChannels * 2); // blockAlign
  setUint16(16); // bitsPerSample

  // "data" sub-chunk
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4); // chunkSize

  // Write interleaved data
  const volume = 0.8;
  let index = pos;
  const channels_data = [];
  
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channels_data.push(audioBuffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      let s = Math.max(-1, Math.min(1, channels_data[i][index]));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(pos, s, true);
      pos += 2;
    }
    index++;
  }

  return arrayBuffer;
}
