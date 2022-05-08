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
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 6px;
  background-color: antiquewhite;
  color: rgb(56, 51, 45);
  font-weight: bold;
  height: 30px;
  width: 25px;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 0px;
}
</style>
