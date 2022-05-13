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
    };
  },
  data() {
    return {
      properties,
      mapping,
      currentChord: "",
      currentVariation: "",
      currentPressedKeys: {},
      currentChordPressedButtons: {
        maj: false,
        min: false,
        maj7: false,
      },
      buffers: [],
      aCtx: new AudioContext(),
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
          fetch(
            "/audio/harp/octave/" + octave + "/note/" + note + "/samples/0.ogg"
          )
            .then((resp) => resp.arrayBuffer())
            .then((buf) =>
              this.aCtx
                .decodeAudioData(buf)
                .then((buf) => (this.buffers[octave][note] = buf))
            );
        }
      }
    },
    evaluateChordVariation() {
      const btn = this.currentChordPressedButtons;

      if (!btn.maj && !btn.min && !btn.maj7) {
        return null;
      }

      if (btn.maj && !btn.min && !btn.maj7) {
        return "maj";
      }

      if (!btn.maj && btn.min && !btn.maj7) {
        return "min";
      }

      if (!btn.maj && !btn.min && btn.maj7) {
        return "maj7";
      }

      if (btn.maj && !btn.min && btn.maj7) {
        return "maj7+";
      }

      if (!btn.maj && btn.min && btn.maj7) {
        return "min7";
      }

      if (btn.maj && btn.min && !btn.maj7) {
        return "dim";
      }

      if (btn.maj && btn.min && btn.maj7) {
        return "aug";
      }
    },
    handleKeyDown(event) {
      // lastE = event
      if (this.currentPressedKeys[event.code]) {
        return;
      }
      this.currentPressedKeys[event.code] = true;
      const x = this.mapping[event.code];
      if (!x) {
        return;
      }
      console.log(event.code + " - down");
      if (x.chordName !== this.currentChord) {
        this.currentChordPressedButtons = {
          maj: false,
          min: false,
          maj7: false,
        };
        // reset all pressed keys?
      }
      this.currentChord = x.chordName;
      this.currentChordPressedButtons[x.buttonType] = true;
      this.currentVariation = this.evaluateChordVariation();

      // pressedChordButtons[event.code] = {}

      console.log("currentChord -> " + this.currentChord);
      console.log(
        "currentChordPressedButtons -> ",
        this.currentChordPressedButtons
      );
      console.log("currentVariation -> " + this.currentVariation);
    },
    handleKeyUp(event) {
      this.currentPressedKeys[event.code] = false;
      const x = this.mapping[event.code];
      if (!x) {
        return;
      }
      console.log(event.code + " - up");
      if (x.chordName !== this.currentChord) {
        return;
      }
      this.currentChordPressedButtons[x.buttonType] = false;
      this.currentVariation = this.evaluateChordVariation();

      if (!this.currentVariation) {
        // TODO: && hold chord false
        this.currentChord = null;
      }
      // lastE = event
      // pressedChordButtons[event.code] = undefined

      console.log("currentChord -> " + this.currentChord);
      console.log(
        "currentChordPressedButtons -> ",
        this.currentChordPressedButtons
      );
      console.log("currentVariation -> " + this.currentVariation);
    },
  },
  computed: {
    currentChordPrettyName() {
      if (!this.currentChord) {
        return "-";
      }
      const chordRoot = this.properties.roots[this.currentChord].display;
      const variation = this.properties.variations[this.currentVariation]
        .display;
      return chordRoot + variation;
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
