<template>
  <div id="chords">
    <h2>
      Current chord:
      {{ currentChordPrettyName }}
    </h2>
    <ChordButtonLabelGroup />
    <ChordButtonGroup
      v-for="(value, key) in properties.roots"
      :key="key"
      :chord="key"
    />
  </div>
  <div id="harp">
    <!-- <HarpOctave
      octave="4"
      :chord="currentChord"
      :variation="currentVariation"
      single-note
    /> -->
    <HarpOctave
      octave="3"
      :chord="currentChord"
      :variation="currentVariation"
    />
    <HarpOctave
      octave="2"
      :chord="currentChord"
      :variation="currentVariation"
    />
    <HarpOctave
      octave="1"
      :chord="currentChord"
      :variation="currentVariation"
    />
    <HarpOctave
      octave="0"
      :chord="currentChord"
      :variation="currentVariation"
    />
  </div>
</template>

<script>
import properties from "./properties.js";
import mapping from "./mapping.js";
import ChordButtonLabelGroup from "./components/ChordButtonLabelGroup.vue";
import ChordButtonGroup from "./components/ChordButtonGroup.vue";
import HarpOctave from "./components/HarpOctave.vue";
import { computed } from "vue";

export default {
  name: "App",
  components: {
    ChordButtonGroup,
    ChordButtonLabelGroup,
    HarpOctave,
  },
  provide() {
    return {
      buttonTypes: computed(() => this.properties.buttonTypes),
      roots: computed(() => this.properties.roots),
      variations: computed(() => this.properties.variations),
      mapping: computed(() => this.mapping),
      currentChord: computed(() => this.currentChord),
      currentPressedKeys: computed(() => this.currentPressedKeys),
      buffers: computed(() => this.buffers),
      audioContext: this.audioContext,
    };
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      properties,
      mapping,
      pressedKeysStack: [],
      currentPressedKeys: {},
      buffers: [],
      audioContext: new AudioContext(),
    };
  },
  created() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.fetchSamples();
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  },
  methods: {
    fetchSamples() {
      for (let octave = 3; octave < 8; octave++) {
        this.buffers[octave] = [];
        for (let note = 0; note < 12; note++) {
          const sampleUrl =
            this.publicPath +
            "audio/harp/octave/" +
            octave +
            "/note/" +
            note +
            "/samples/0.ogg";
          fetch(sampleUrl)
            .then((resp) => resp.arrayBuffer())
            .then((buf) => this.audioContext.decodeAudioData(buf))
            .then((decoded) => {
              this.buffers[octave][note] = decoded;
            })
            .catch(() =>
              console.log(
                "WARN - sample '" + sampleUrl + "' not found or loaded."
              )
            );
        }
      }
    },
    handleKeyDown(event) {
      if (this.currentPressedKeys[event.code]) {
        return;
      }
      this.currentPressedKeys[event.code] = true;

      const mappingEntry = this.mapping[event.code];
      if (!mappingEntry) {
        return;
      }
      
      this.properties.roots[mappingEntry.chordName][mappingEntry.buttonType] = true;
      
      this.pressedKeysStack.push(event.code);
    },
    handleKeyUp(event) {
      this.currentPressedKeys[event.code] = false;
      
      const mappingEntry = this.mapping[event.code];
      if (!mappingEntry) {
        return;
      }
      
      this.properties.roots[mappingEntry.chordName][mappingEntry.buttonType] = false;
      
      this.pressedKeysStack.splice(this.pressedKeysStack.indexOf(event.code), 1);
    },
  },
  computed: {
    currentChord() {
      if (this.pressedKeysStack.length == 0) {
        return null;
      }

      const lastPressedKey = this.pressedKeysStack[this.pressedKeysStack.length - 1]

      return this.mapping[lastPressedKey].chordName;
    },
    currentChordPrettyName() {
      if (!this.currentChord || !this.currentVariation) {
        return "-";
      }
      const chordRoot = this.properties.roots[this.currentChord].display;
      const variation =
        this.properties.variations[this.currentVariation].display;
      return chordRoot + variation;
    },
    currentVariation() {
      if (!this.currentChord) {
        return null;
      }

      const maj = this.properties.roots[this.currentChord].maj;
      const min = this.properties.roots[this.currentChord].min;
      const maj7 = this.properties.roots[this.currentChord].maj7;

      if (maj && !min && !maj7) {
        return "maj";
      }

      if (!maj && min && !maj7) {
        return "min";
      }

      if (!maj && !min && maj7) {
        return "maj7";
      }

      if (maj && !min && maj7) {
        return "maj7+";
      }

      if (!maj && min && maj7) {
        return "min7";
      }

      if (maj && min && !maj7) {
        return "dim";
      }

      if (maj && min && maj7) {
        return "aug";
      }

      return null;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  cursor: default;
  user-select: none;
}
</style>
