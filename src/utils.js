export function handleVolume(zeroToTen) {
    zeroToTen = Math.min(Math.max(zeroToTen, 0), 10);
    const zeroToOne = zeroToTen / 10;
    const minGain = 0.0001;
    const maxGain = 1.0;
    return Math.min(Math.max(zeroToOne, minGain), maxGain);
}

export function fadeVolume(targetVolume, duration, gainNode, audioContext) {

  // const now = audioContext.currentTime;
  const currentValue = gainNode.gain.value;
  gainNode.gain.cancelScheduledValues(audioContext.currentTime);
  gainNode.gain.setValueAtTime(currentValue, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(handleVolume(targetVolume), audioContext.currentTime + duration);
}

export function createTremoloFX(audioContext) {

  const tremoloNode = audioContext.createGain();
  tremoloNode.gain.value = 1;

  const tremoloLFO = audioContext.createOscillator();
  tremoloLFO.frequency.value = 4; // Hz
  tremoloLFO.type = 'sine';
  tremoloLFO.start();

  const lfoGain = audioContext.createGain();
  lfoGain.gain.value = 0.1; // Tremolo depth (0 to 1)

  tremoloLFO.connect(lfoGain);
  lfoGain.connect(tremoloNode.gain);

  return {
    node: tremoloNode,
    changeDepth: (depth) => {
      lfoGain.gain.value = depth;
    },
    changeRate: (rate) => {
      tremoloLFO.frequency.value = rate;
    }
  };
}