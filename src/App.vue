<template>
  <h2>Current chord: {{ currentChord }}</h2>
  <ChordButtonGroup
    v-for="(value, key) in properties.roots"
    :key="key"
    :chord="key"
  />
</template>

<script>
import properties from "./properties.js";
import mapping from "./mapping.js";
import ChordButtonGroup from "./components/ChordButtonGroup.vue";
import { computed } from "vue";

export default {
  name: "App",
  components: {
    ChordButtonGroup,
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
