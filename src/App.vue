<template>
  <div id="chords">
    <h2>Current chord: {{ currentChord }}</h2>
    <ChordButtonLabelGroup />
    <ChordButtonGroup v-for="(value, key) in properties.roots" :key="key" :chord="key" />
  </div>
  <div id="harp">
    <HarpOctave octave="5" single-note />
    <HarpOctave octave="4" />
    <HarpOctave octave="3" />
    <HarpOctave octave="2" />
    <HarpOctave octave="1" />
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
    };
  },
  data() {
    return {
      properties,
      mapping,
      currentChord: "not implemented",
    };
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
}
</style>
