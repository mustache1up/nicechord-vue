<template>
  <div class="harp-octave">
    <HarpButton v-if="!singleNote" :octave="octave" :note="note(2)" />
    <HarpButton v-if="!singleNote" :octave="octave" :note="note(1)" />
    <HarpButton :octave="octave" :note="note(0)" dot/>
  </div>
</template>

<script>
import HarpButton from "./HarpButton.vue";
export default {
  name: "HarpOctave",
  components: {
    HarpButton,
  },
  props: {
    octave: String,
    chord: String,
    variation: String,
    singleNote: Boolean,
  },
  inject: ["variations"],
  methods: {
    note(n) {
      console.log(n)
      var rootAsNumber = 10;
      var tonesToAdvance = parseInt(this.variations['maj'].harpTones[n]);
      return (rootAsNumber + tonesToAdvance) % 12
    }
  },
};
</script>

<style scoped>
.harp-octave {

  cursor: pointer;
  /* display: inline-block; */
}
</style>
