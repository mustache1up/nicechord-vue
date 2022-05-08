<template>
  <div class="chord-group">
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
  inject: ["buttonTypes"],
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

.chord-group {
  display: inline-block;
}
</style>
