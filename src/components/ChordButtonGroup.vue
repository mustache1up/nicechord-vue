<template>
  <ChordButton :chord="chord" variant="maj" />
  <ChordButton :chord="chord" variant="min" />
  <ChordButton :chord="chord" variant="maj+" />
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
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
