<template>
  <div class="chord-group">
    <div class="chord-title">{{ display }}</div>
    <ChordButton
      v-for="(lineDesc, buttonLineIndex) in buttonLines"
      :key="buttonLineIndex"
      :chord="chord"
      :button-line="buttonLineIndex"
      :line-desc="lineDesc"
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
  inject: ["buttonLines", "roots"],
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
