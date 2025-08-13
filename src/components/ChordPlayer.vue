<template>
  <div>
    
  </div>
</template>


<script setup>
import { inject, watch, ref } from 'vue';
import { handleVolume, fadeVolume } from '../utils';

const props = defineProps({
  currentChordObj: Object,
});

const chordBuffers = inject('chordBuffers');
const audioContext = inject('audioContext');
const controls = inject('controls');

const source = ref(null);
const buf = ref(null);
const status = ref({
  playing: false,
  started: 0,
});

function prepareNewBufferSource() {
  // TODO do not recreate gain nodes every time
  const src = audioContext.createBufferSource();
  src.preGainNode = audioContext.createGain();
  src.preGainNode.gain.value = 0.5;
  src.gainNode = audioContext.createGain();
  src.buffer = buf.value;
  src.connect(src.preGainNode);
  src.preGainNode.connect(src.gainNode);
  src.gainNode.connect(audioContext.destination);
  return src;
}


function startSource(src, options = {
  fadeInSeconds: 0,
  startPositionSeconds: 0
}) {
  if (options.fadeInSeconds) {
    src.gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    src.gainNode.gain.linearRampToValueAtTime(handleVolume(controls.value.chord.volume), audioContext.currentTime + options.fadeInSeconds);
  }
  src.loop = true;
  src.start(0, options.startPositionSeconds);
}

function stopSource(src, options = {
  fadeOutSeconds: 0
}) {
  if (options.fadeOutSeconds) {
    src.gainNode.gain.setValueAtTime(src.gainNode.gain.value, audioContext.currentTime);
    src.gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + options.fadeOutSeconds);
  }
  src.stop();
  src.onended = undefined;
}

watch(() => controls.value.chord.volume, (newVolume) => {
  if (source.value && source.value.gainNode) {
    fadeVolume(newVolume, 0.3, source.value.gainNode, audioContext);
  }
});

watch(() => props.currentChordObj, (newCurrentChordObj) => {

  // console.log("New current chord object:", newCurrentChordObj);
  const crossoverSeconds = 0.01;

  if (!newCurrentChordObj.chord || !newCurrentChordObj.variation) {
          // when chord memory is off stop current chord if any 
    stopSource(source.value, {
      fadeOutSeconds: crossoverSeconds
    });
    status.value.playing = false;
    return;
  }

  if (status.value.playing) {
    stopSource(source.value, {
      fadeOutSeconds: crossoverSeconds
    });
  }

  buf.value = chordBuffers.value[newCurrentChordObj.variation][newCurrentChordObj.chord];
  source.value = prepareNewBufferSource();

  startSource(source.value, {
    fadeInSeconds: crossoverSeconds,
    startPositionSeconds: 0
  });

  status.value.playing = true;
}, { flush: 'post' });

</script>

<style scoped>
</style>
