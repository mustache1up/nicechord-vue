<template>
  <div class="chord-group">
    <div class="chord-title">{{ display }}</div>
    <ChordButton
      v-for="(value, key) in buttonTypes"
      :key="key"
      :chord="chord"
      :button-type="key"
    />
  </div>
</template>

<script>
import ChordButton from "./ChordButton.vue";
export default {
  name: "ChordButtonGroup",
  components: {
    ChordButton,
  },
  props: {
    chord: String,
  },
  inject: ["buttonTypes", "roots"],
  computed: {
    display() {
      return this.roots[this.chord].display;
    },
  },
};
</script>

<style scoped>

.chord-title {
  color:antiquewhite;
  font-weight: bold;
}
.chord-group {
  display: inline-block;
  margin-left: 3px;
  margin-right: 3px;
}
</style>
