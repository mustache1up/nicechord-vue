<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <ChordButtonGroup chord="Bb" />
  <ChordButtonGroup chord="Eb" />
</template>

<script>
import ChordButtonGroup from "./components/ChordButtonGroup.vue";
export default {
  name: "App",
  components: {
    ChordButtonGroup,
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
