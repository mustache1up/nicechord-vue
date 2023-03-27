<template>
  <div
    class="chord-button"
    :class="{
      'chord-button-active': currentPressedKeys[keyCode],
    }"
  >
    {{ display }}
  </div>
</template>

<script>
export default {
  name: "ChordButton",
  props: {
    chord: String,
    buttonType: String,
  },
  inject: ["mapping", "currentPressedKeys"],
  computed: {
    keyCode() {
      for (const key in this.mapping) {
        const element = this.mapping[key];
        if (
          element.chordName === this.chord &&
          element.buttonType === this.buttonType
        ) {
          return key;
        }
      }
      return null;
    },
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
  position: relative;
  left: calc(var(--nth-index) * 6px);
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 6px;
  background-color: antiquewhite;
  color: rgb(224, 210, 193);
  font-weight: bold;
  height: 45px;
  width: 30px;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 0px;
}
.chord-button-active {
  background-color: rgb(197, 187, 175);
}
</style>
