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