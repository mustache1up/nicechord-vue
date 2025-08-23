<template>
</template>

<script setup>
import { inject, watch, ref, reactive, computed } from 'vue';
import { handleVolume, fadeVolume, createTremoloFX } from '../utils';

const props = defineProps({
  currentChordObj: Object,
  harpNotesStatus: Object,
});

const buffers = inject("buffers");
const audioContext = inject('audioContext');
const controls = inject('controls');
const roots = inject('roots');
const variations = inject('variations');

const preGainNode = audioContext.createGain();
preGainNode.gain.value = 0.5;

const gainNode = audioContext.createGain();

const tremoloFX = createTremoloFX(audioContext);

preGainNode.connect(tremoloFX.node);
tremoloFX.node.connect(gainNode);
gainNode.connect(audioContext.destination);

watch(() => controls.value.harp.volume, (newVolume) => {
  if (gainNode) {
    fadeVolume(newVolume, 0.3, gainNode, audioContext);
  }
});

watch(() => controls.value.harp.tremoloDepth, (newDepth) => {
  tremoloFX.changeDepth(newDepth);
}, { immediate: true });

watch(() => controls.value.harp.tremoloRate, (newRate) => {
  tremoloFX.changeRate(newRate);
}, { immediate: true });

/////////////////       CRIAR A OUTRA VOZ DO HARP       /////////////////

const crossoverSeconds = 0.01;
const status = {};

for(let octaveIndex = 0; octaveIndex < 4; octaveIndex++) {
  for(let noteIndex = 0; noteIndex < 3; noteIndex++) {
    const buttonId = `${octaveIndex}:${noteIndex}`;
    status[buttonId] = {
      buttonId: buttonId,
      octaveIndex: octaveIndex,
      noteIndex: noteIndex,
      octaveNumber: null,
      noteBMN: null,
      playing: false,
      started: 0,
      buf: null,
      source: null,
    };
  }
}
console.log("INFO - harp notes status:", status);


watch(() => props.currentChordObj, (currentChordObj) => {

  for(const buttonId in status) {
    const noteStatus = status[buttonId];

    if (!currentChordObj.chord || !currentChordObj.variation) {
      noteStatus.octaveNumber = -1
      noteStatus.noteBMN = -1
      continue;
    }

    // console.log(currentChordObj.chord)
    // console.log(roots.value)
    // console.log(roots.value[currentChordObj.chord])

    var rootNoteNumber = roots.value[currentChordObj.chord].noteNumber;
    var tonesToAdvance = parseInt(variations.value[currentChordObj.variation].harpTones[noteStatus.noteIndex]);
    var noteBMN = (rootNoteNumber + tonesToAdvance) % 12;
    var noteOctave = (noteBMN <= 5 ? noteStatus.octaveIndex : noteStatus.octaveIndex - 1) - -4;
    noteStatus.octaveNumber = noteOctave
    noteStatus.noteBMN = noteBMN

    try {
      noteStatus.buf = buffers.value[noteOctave][noteBMN];
    } catch (e) {
      console.error("Buffer not found for octave:", props.octave, "note:", props.note);
      console.error(buffers.value);
      return;
    }

    if(noteStatus.playing) {
      play(noteStatus, true);
    }
  }
}, { flush: "post" });

/*
function prepareNewBufferSource() {

  const src = audioContext.createBufferSource();
  src.buffer = buf.value;

  src.connect(preGainNode);
  return src;
}
*/

function prepareNewBufferSource(noteStatus) {
  
  noteStatus.source = audioContext.createBufferSource();
  noteStatus.source.gainNode = audioContext.createGain();
  noteStatus.source.buffer = noteStatus.buf; 
  noteStatus.source.connect(noteStatus.source.gainNode);
  noteStatus.source.gainNode.connect(preGainNode);
  noteStatus.source.onended = function () {
    noteStatus.playing = false;
  };
}

function startSource(noteStatus, options = {
  fadeInSeconds: 0,
  startPositionSeconds: 0
}) {
  if (options.fadeInSeconds) {
    noteStatus.source.gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    noteStatus.source.gainNode.gain.linearRampToValueAtTime(handleVolume(controls.value.harp.volume), audioContext.currentTime + options.fadeInSeconds);
  }
  noteStatus.source.start(0, options.startPositionSeconds);
}

function stopSource(noteStatus, options = {
  fadeOutSeconds: 0
}) {
  if (options.fadeOutSeconds) {
    noteStatus.source.gainNode.gain.setValueAtTime(noteStatus.source.gainNode.gain.value, audioContext.currentTime);
    noteStatus.source.gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + options.fadeOutSeconds);
  }
  noteStatus.source.stop(audioContext.currentTime + options.fadeOutSeconds + 0.1);
  noteStatus.source.onended = undefined;
}

function play(noteStatus, crossover = false) {
  if (noteStatus.octaveNumber < 0) {
    // console.debug("no chord select on play"); 
    return;
  }

  if (noteStatus.playing) {
    const fadeOutSeconds = crossover ? crossoverSeconds : 0.5
    stopSource(noteStatus, { fadeOutSeconds: fadeOutSeconds });
  }

  prepareNewBufferSource(noteStatus);

  const startPositionSeconds = crossover ? audioContext.currentTime - noteStatus.started + 0.3 : 0
  startSource(noteStatus, {
    fadeInSeconds: crossoverSeconds,
    startPositionSeconds: startPositionSeconds
  });

  if (!crossover) {
    noteStatus.started = audioContext.currentTime;
  }

  noteStatus.playing = true;
}


for(const buttonId in status) {
  const noteStatus = status[buttonId];
  watch(() => props.harpNotesStatus[noteStatus.buttonId], (isPressed) => {
    if (isPressed) {
      // console.log(buttonId, "pressed");
      play(noteStatus);
    }
  });
}

</script>
