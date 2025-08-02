<template>
  <div name="harp-button" class="harp-button" :data-button-id="buttonId" :pressed="pressed">
  <!-- @mouseenter="play" -->
    <div name="tri-pad">
      <div name="single-pad" class="single-pad"></div>
      <div name="single-pad" class="single-pad"></div>
      <div name="single-pad" class="single-pad"></div>
    </div>
    <div>
      <div v-if="dot" class="single-dot"></div>
    </div>
  </div>
</template>


<script setup>
import { inject, ref, watch, computed } from 'vue';

const props = defineProps({
  buttonId: String,
  octave: Number,
  note: Number,
  dot: Boolean,
  harpNotesStatus: Object,
});

const pressed = computed(() => {
  return props.harpNotesStatus[props.buttonId] || false;
});

const buffers = inject("buffers");
const audioContext = inject("audioContext");
const controls = inject("controls");

const crossoverSeconds = 0.01;
const status = ref({
  playing: false,
  started: 0
});
let buf = null;
let source = audioContext.createBufferSource();

function prepareNewBufferSource() {
  const newSource = audioContext.createBufferSource();
  newSource.gainNode = audioContext.createGain();
  newSource.buffer = buf;
  newSource.connect(newSource.gainNode);
  newSource.gainNode.connect(audioContext.destination);
  newSource.onended = function () {
    status.value.playing = false;
  };
  return newSource;
}

function startSource(src, options = {
  fadeInSeconds: 0,
  startPositionSeconds: 0
}) {
  if (options.fadeInSeconds) {
    src.gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    src.gainNode.gain.linearRampToValueAtTime((controls.value.harp.volume / 10.0), audioContext.currentTime + options.fadeInSeconds);
  }
  src.start(0, options.startPositionSeconds);
}

function stopSource(src, options = {
  fadeOutSeconds: 0
}) {
  if (options.fadeOutSeconds) {
    src.gainNode.gain.setValueAtTime(src.gainNode.gain.value, audioContext.currentTime);
    src.gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + options.fadeOutSeconds);
  }
  src.stop(audioContext.currentTime + options.fadeOutSeconds + 0.1);
  src.onended = undefined;
}

function play() {
  if (props.octave < 0) {
    console.log("no chord select");
    return;
  }

  if (status.value.playing) {
    stopSource(source, { fadeOutSeconds: 0.5 });
  }

  source = prepareNewBufferSource();

  startSource(source, {
    fadeInSeconds: crossoverSeconds,
    startPositionSeconds: 0
  });

  status.value.started = audioContext.currentTime;
  status.value.playing = true;
}

watch(() => props.harpNotesStatus[props.buttonId], (currentNoteStatus) => {
  console.log(`harpNotesStatus changed for ${props.buttonId}:`, currentNoteStatus);
  if (currentNoteStatus) {
    play();
  }
});

watch(() => props.note, () => {
  if (props.octave < 0) {
    return;
  }

  try {
    buf = buffers.value[props.octave][props.note];
  } catch (e) {
    console.error("Buffer not found for octave:", props.octave, "note:", props.note);
    console.error(buffers.value);
    return;
  }

  if (!status.value.playing) {
    return;
  }

  stopSource(source, {
    fadeOutSeconds: crossoverSeconds
  });

  source = prepareNewBufferSource();

  startSource(source, {
    fadeInSeconds: crossoverSeconds,
    startPositionSeconds: audioContext.currentTime - status.value.started + 0.3
  });

  status.value.playing = true;
}, { flush: "post" });
</script>



<style scoped>
.harp-button {
  position: relative;
  left: calc(var(--nth-last-index) * 3px);
  cursor: pointer;
  width: 130px;
  /* display: inline-block; */
}
.harp-button[pressed="true"] .single-pad {
  transition: background-size 15s ease;
  background-position-x: 50%;
}

.single-pad {
  position: relative;
  left: calc(var(--nth-last-index) * 1px);
  margin-top: 3px;
  margin-bottom: 3px;
  border-radius: 3px;
  background: linear-gradient(to right, #d8812a, #f0dca6, #fff5d7);
  transition: background-position 1s ease;
  background-size: 200% 200%;
  padding: 0;
  width: 120px;
  height: 3px;
}
.single-dot {
  top: -15px;
  margin-top: 3px;
  margin-bottom: 3px;
  border-radius: 3px;
  background: linear-gradient(to right, #feba71, #ffe28c);
  padding: 0;
  width: 3px;
  height: 3px;
  float: right;
  position: relative;
}
</style>
