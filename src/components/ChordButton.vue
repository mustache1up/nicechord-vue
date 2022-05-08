<template>
  <div class="chord-button">{{ display }}</div>
</template>

<script>
export default {
  name: "ChordButton",
  props: {
    chord: String,
    buttonType: String,
  },
  inject: ["mapping"],
  computed: {
    display() {
      for (const key in this.mapping) {
        const element = this.mapping[key];
        if (
          element.chordName === this.chord &&
          element.buttonType === this.buttonType
        ) {
          return element.display;
        }
      }
      return "-";
    },
  },
};
</script>

<style scoped>
.chord-button {
  border-style: dotted;
  border-width: 1px;
  border-radius: 5px;
  border-color: gray;
  color: antiquewhite;
  height: 30px;
  width: 20px;
}
</style>
