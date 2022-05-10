<template>
  <div id="chords">
    <h2>Current chord: {{ currentChord }}</h2>
    <ChordButtonLabelGroup />
    <ChordButtonGroup v-for="(value, key) in properties.roots" :key="key" :chord="key" />
  </div>
  <div id="harp">
    <HarpOctave octave="4" :chord="currentChord" :variation="currentVariation" single-note />
    <HarpOctave octave="3" :chord="currentChord" :variation="currentVariation" />
    <HarpOctave octave="2" :chord="currentChord" :variation="currentVariation" />
    <HarpOctave octave="1" :chord="currentChord" :variation="currentVariation" />
    <HarpOctave octave="0" :chord="currentChord" :variation="currentVariation" />
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
      currentChord: "bb",
      currentVariation: "maj",
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
  cursor: default;
  user-select: none;
}
</style>
