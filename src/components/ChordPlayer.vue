<template>
</template>

<script setup>
import { inject, watch, ref } from 'vue';
import { handleVolume, fadeVolume, createTremoloFX } from '../utils';

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

const preGainNode = audioContext.createGain();
preGainNode.gain.value = 0.20;

const gainNode = audioContext.createGain();

const tremoloFX = createTremoloFX(audioContext);

preGainNode.connect(tremoloFX.node);
tremoloFX.node.connect(gainNode);
gainNode.connect(audioContext.destination);

function prepareNewBufferSource() {

  const src = audioContext.createBufferSource();
  src.buffer = buf.value;

  src.connect(preGainNode);
  return src;
}


function startSource(src, options = {
  fadeInSeconds: 0,
  startPositionSeconds: 0
}) {
  if (options.fadeInSeconds) {
    gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(handleVolume(controls.value.chord.volume), audioContext.currentTime + options.fadeInSeconds);
  }
  src.loop = true;
  src.start(0, options.startPositionSeconds);
}

function stopSource(src, options = {
  fadeOutSeconds: 0
}) {
  if (options.fadeOutSeconds) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + options.fadeOutSeconds);
  }
  src.stop();
}

watch(() => controls.value.chord.volume, (newVolume) => {
  if (source.value && gainNode) {
    fadeVolume(newVolume, 0.3, gainNode, audioContext);
  }
});

watch(() => controls.value.chord.tremoloDepth, (newDepth) => {
  tremoloFX.changeDepth(newDepth);
}, { immediate: true });

watch(() => controls.value.chord.tremoloRate, (newRate) => {
  tremoloFX.changeRate(newRate);
}, { immediate: true });

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
