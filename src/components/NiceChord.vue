<template>
  <div v-if="showLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
    <div class="text-center text-white p-8 rounded-lg shadow-lg bg-gray-900/80">
      <h2 class="text-2xl mb-4">Loading Samples...</h2>
      <div class="mb-2">Harp Samples: <span class="font-bold">{{ harpPercent }}%</span></div>
      <div>Chord Samples: <span class="font-bold">{{ chordPercent }}%</span></div>
    </div>
  </div>
  <div class="flex flex-row relative">
    <div id="chord-fieldset-container" class="knob">
      <Fieldset id="chord-fieldset" legend="chord">
        <b> {{ currentChordPrettyName }} </b>
      </Fieldset>
    </div>
    <div class="knob">
      <knob v-model="controls.chord.volume" :min="0.0" :max="10.0" :step="0.1" :maxFractionDigits="1" value-template="chord"
        valueColor="MediumTurquoise" rangeColor="SlateGray" textColor="MediumTurquoise" />
    </div>
    <div class="knob">
      <knob v-model="controls.harp.volume" :min="0.0" :max="10.0" :step="0.1" value-template="harp"
        valueColor="Red" rangeColor="SlateGray" textColor="Red" />
    </div>
  </div>
  <div class="flex flex-row relative" style="align-items:center;">
    <div id="chords">
      <ChordPlayer :currentChordObj="currentChordObj" />
      <ChordButtonLabelGroup />
      <ChordButtonGroup
        v-for="(value, key) in properties.roots"
        :key="key"
        :chord="key"
        :currentChordObj="currentChordObj"
      />
    </div>
    <div id="harp">
      <!-- <HarpOctave
        :octaveId="4"
        :currentChordObj="currentChordObj"
        single-note
      /> -->
      <HarpOctave
        :octaveId="3"
        :currentChordObj="currentChordObj"
        :harpNotesStatus="harpNotesStatus"
      />
      <HarpOctave
        :octaveId="2"
        :currentChordObj="currentChordObj"
        :harpNotesStatus="harpNotesStatus"
      />
      <HarpOctave
        :octaveId="1"
        :currentChordObj="currentChordObj"
        :harpNotesStatus="harpNotesStatus"
      />
      <HarpOctave
        :octaveId="0"
        :currentChordObj="currentChordObj"
        :harpNotesStatus="harpNotesStatus"
      />
    </div>
  </div>
</template>


<script setup>
import properties from "@/properties.js";
import mapping from "@/mapping.js";
import ChordPlayer from "@/components/ChordPlayer.vue";
import ChordButtonLabelGroup from "@/components/ChordButtonLabelGroup.vue";
import ChordButtonGroup from "@/components/ChordButtonGroup.vue";
import HarpOctave from "@/components/HarpOctave.vue";
import { ref, computed, provide, onMounted, onBeforeUnmount, watchEffect } from "vue";

const baseUrl = import.meta.env.BASE_URL;
const controls = ref({
  chord: { volume: 5 },
  harp: { volume: 5 }
});
const pressedKeysStack = ref([]);
const currentPressedKeys = ref({});
const buffers = ref([]);
const chordBuffers = ref([]);
const audioContext = new AudioContext();

const touchStates = {}; 
const harpNotesStatus = ref({}); 

const currentChordObj = computed(() => ({
  chord: currentChord.value,
  variation: currentVariation.value
}));

provide('buttonLines', computed(() => properties.buttonLines));
provide('roots', computed(() => properties.roots));
provide('variations', computed(() => properties.variations));
provide('mapping', computed(() => mapping));
provide('currentPressedKeys', computed(() => currentPressedKeys.value));
provide('buffers', computed(() => buffers.value));
provide('chordBuffers', computed(() => chordBuffers.value));
provide('controls', computed(() => controls.value));
provide('audioContext', audioContext);


const chordPercent = ref(0);
const harpPercent = ref(0);
const showLoading = ref(true);

const fetchChordSamples = async () => {
  const promises = [];
  let loaded = 0;
  const total = Object.keys(properties.variations).length * Object.keys(properties.roots).length;

  for (const variation in properties.variations) {
    chordBuffers.value[variation] = [];
    for (const root in properties.roots) {
      const sampleUrl =
        baseUrl +
        "audio/chords/variations/" +
        variation +
        "/" +
        root +
        ".ogg";
      const p = fetch(sampleUrl)
        .then((resp) => resp.arrayBuffer())
        .then((buf) => audioContext.decodeAudioData(buf))
        .then((decoded) => {
          chordBuffers.value[variation][root] = decoded;
        })
        .catch(() =>
          console.debug("WARN - sample '" + sampleUrl + "' not found or loaded.")
        )
        .finally(() => {
          loaded++;
          chordPercent.value = Math.round((loaded / total) * 100);
          // console.log(`Chord samples loading: ${chordPercent.value}%`);
        });
      promises.push(p);
    }
  }
  console.log("INFO - fetching " + promises.length + " chord samples...");
  await Promise.all(promises);
};

const fetchHarpSamples = async () => {
  const promises = [];
  let loaded = 0;
  const total = (8 - 3) * 12; // octaves 3 to 7, 12 notes each

  for (let octave = 3; octave < 8; octave++) {
    buffers.value[octave] = [];
    for (let note = 0; note < 12; note++) {
      const sampleUrl =
        baseUrl +
        "audio/harp/octave/" +
        octave +
        "/note/" +
        note +
        "/samples/0.ogg";
      const p = fetch(sampleUrl)
        .then((resp) => resp.arrayBuffer())
        .then((buf) => audioContext.decodeAudioData(buf))
        .then((decoded) => {
          buffers.value[octave][note] = decoded;
        })
        .catch(() =>
          console.debug("WARN - sample '" + sampleUrl + "' not found or loaded.")
        )
        .finally(() => {
          loaded++;
          harpPercent.value = Math.round((loaded / total) * 100);
          // console.log(`Harp samples loading: ${harpPercent.value}%`);
        });
      promises.push(p);
    }
  }
  console.log("INFO - fetching " + promises.length + " harp samples...");
  await Promise.all(promises);
};

const handleKeyDown = (event) => {
  console.log(`Key down: ${event.code}`);
  if (event.code === 'Escape') {
    console.log(`Escaping pressed keys...`);
    pressedKeysStack.value = [];
    for (const chordName in properties.roots) {
      for (let buttonLine = 0; buttonLine < 3; buttonLine++) {
        properties.roots[chordName][buttonLine] = false;
      }
    }
    currentPressedKeys.value = {};
    currentChord.value = null;
    currentVariation.value = null;
    console.log(`Pressed keys cleared.`);
    return;
  }

  if (currentPressedKeys.value[event.code]) {
    return;
  }
  currentPressedKeys.value[event.code] = true;

  const mappingEntry = mapping[event.code];
  if (!mappingEntry) {
    return;
  }
  properties.roots[mappingEntry.chordName][mappingEntry.buttonLine] = true;
  pressedKeysStack.value.push(event.code);
};

let handleKeyUpTimeoutId = null;
const pendingKeyUpsSet = new Set();

const handleKeyUpDebounced = (event) => {
  console.log(`Key up: ${event.code}`);

  // TODO maybe only for variations of same chord, to other chords might be handled immediately

  if (handleKeyUpTimeoutId) {
    clearTimeout(handleKeyUpTimeoutId);
  }
  
  pendingKeyUpsSet.add(event.code);

  handleKeyUpTimeoutId = setTimeout(() => {
    for (const key of pendingKeyUpsSet) {
      handleKeyUp(key);
    }
    pendingKeyUpsSet.clear();
  }, 40);

};

const handleKeyUp = (code) => {
  currentPressedKeys.value[code] = false;

  const mappingEntry = mapping[code];
  if (!mappingEntry) {
    return;
  }
  properties.roots[mappingEntry.chordName][mappingEntry.buttonLine] = false;
  const idx = pressedKeysStack.value.indexOf(code);
  if (idx !== -1) {
    pressedKeysStack.value.splice(idx, 1);
  }
};


onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUpDebounced);
  // Run both sample fetches in parallel and hide loading when both are done
  Promise.all([
    fetchHarpSamples(),
    fetchChordSamples()
  ]).then(() => {
    showLoading.value = false;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUpDebounced);
});

const currentChord = ref(null);
const currentVariation = ref(null);

watchEffect(() => {
  if (pressedKeysStack.value.length === 0) {
    return // TODO if memory
  }

  const lastPressedKey = pressedKeysStack.value[pressedKeysStack.value.length - 1];
  currentChord.value = mapping[lastPressedKey]?.chordName;
  currentVariation.value = evaluateCurrentVariation();
});

const evaluateCurrentVariation = () => {

  let combinationAsInt = 0;
  for (let i = 0; i < 3; i++) {
    combinationAsInt = (combinationAsInt << 1) | (properties.roots[currentChord.value][i] ? 1 : 0);
  }

  return properties.combinations[combinationAsInt] ?? null;
};

const currentChordPrettyName = computed(() => {
  if (!currentChord.value || !currentVariation.value) {
    return "-";
  }
  const chordRoot = properties.roots[currentChord.value].display;
  const variation = properties.variations[currentVariation.value].display;
  return chordRoot + variation;
});

const elementFromClientXandY = (clientX, clientY) => {
  let element = document.elementFromPoint(clientX, clientY);
  const name = element.attributes.name?.nodeValue;
  // console.debug(`original element touched name:`, name);
  const harpButtonNames = ['harp-button', 'tri-pad', 'single-pad']; // harp-button childs in order of hierarchy
  let levelsToGoUp = harpButtonNames.indexOf(name);
  while (levelsToGoUp > 0) {
    element = element.parentElement;
    levelsToGoUp--;
  }
  return levelsToGoUp === -1 ? null : element;
}

const handleChangedTouches = (interactionEvents, touchEnd = false) => {
  
  // console.log("interactionEvents", interactionEvents)
  for(let interactionEvent of interactionEvents) {
    // console.debug(`Event detected:`, interactionEvent);
    // const interactionEvent = interactionEvents[i];
    const touchId = interactionEvent.identifier ?? 'mouse';
    let buttonId = undefined;
    if (!touchEnd) {
      const element = elementFromClientXandY(interactionEvent.clientX, interactionEvent.clientY);
      const name = element?.attributes?.name?.nodeValue;
      if (!element || name !== 'harp-button') {
        // console.debug(`Touch ${touchId} moved on non-harp-button element.`);
        return;
      }
      // console.log(`Touch ${touchId} moved on harp-button:`, element);
      // console.log(`Touch ${touchId} moved on harp-button named:`, name);
      
      buttonId = element.attributes['data-button-id']?.value
    }

    // console.log(`Touch ${touchId} moved on harp-button buttonId:`, buttonId);
    const previousButtonId = touchStates[touchId];
    if (buttonId !== previousButtonId) {
      // console.log(`Touch ${touchId} moved from ${previousButtonId} to ${buttonId}`);

      touchStates[touchId] = buttonId; // Update touch state reactively
      // console.log(`touchStates: `, touchStates);

      if (previousButtonId) {
        harpNotesStatus.value[previousButtonId] = false;
      }

      harpNotesStatus.value[buttonId] = true;
      // console.log(`harpNotesStatus:`, harpNotesStatus.value);
    }

    if (touchEnd) {
      delete touchStates[touchId]
    }
  }
};

const handleHarpEvent = (event) => {

  // console.debug(`handleHarpEvent:`, event);
  if (event.type === 'mousedown' || event.type === 'mousemove' || event.type === 'mouseup') {
    let isTouchEnd = false;
    const primaryButtonPressed = event.buttons & 0b1
    if (!primaryButtonPressed) {
      if (!touchStates['mouse']) {
        // console.debug(`Mouse moved with no button pressed and is not listed already, nothign to do.`);
        return;
      }
      isTouchEnd = true;
    } else if (event.type === 'mouseup') {
      isTouchEnd = true;      
    }
    handleChangedTouches([event], isTouchEnd);
  } else {
    const isTouchEnd = event.type === 'touchend' || event.type === 'touchcancel';
    handleChangedTouches(event.changedTouches, isTouchEnd);
  }
};

onMounted(() => {
  const harp = document.getElementById('harp');
  if (harp) {
    harp.addEventListener('mousedown', handleHarpEvent);
    harp.addEventListener('mousemove', handleHarpEvent);
  }
  window.addEventListener('touchmove', handleHarpEvent);
  window.addEventListener('touchstart', handleHarpEvent);
  window.addEventListener('mouseup', handleHarpEvent);
  window.addEventListener('touchend', handleHarpEvent);
  window.addEventListener('touchcancel', handleHarpEvent);
  window.addEventListener('contextmenu', (e) => e.preventDefault());
});

onBeforeUnmount(() => {
  const harp = document.getElementById('harp');
  if (harp) {
    harp.removeEventListener('mousedown', handleHarpEvent);
    harp.removeEventListener('mousemove', handleHarpEvent);
  }
  window.removeEventListener('touchmove', handleHarpEvent);
  window.removeEventListener('touchstart', handleHarpEvent);
  window.removeEventListener('mouseup', handleHarpEvent);
  window.removeEventListener('touchend', handleHarpEvent);
  window.removeEventListener('touchcancel', handleHarpEvent);
  window.removeEventListener('contextmenu', (e) => e.preventDefault());
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #87aece;
  /* margin-top: 60px; */
  cursor: default;
  user-select: none;
}
#chords {
  display: inline-block;
  padding-right: 3vw;
}
#harp {
  display: inline-block;
  padding-left: 3vw;
}
#current-chord-label {
  display: inline-block;
}
#current-chord {
  display: inline-block;
  padding-left: 10px;
  width: 40px;
}
.knob {
  display: inline-block;
  padding: 0 15px;
}
.knob .p-fieldset-legend   {
  padding: 10px !important;
}
.knob .p-fieldset-content   {
  font-size: xx-large !important;
  padding: 5px !important;
}
#chord-fieldset-container {
  position: relative;
  top: -30px;
}
#chord-fieldset {
  width: 145px;
}
.flex {
    display: flex;
}
.flex-row {
    flex-direction: row;
}
.relative {
    position: relative;
}
</style>

