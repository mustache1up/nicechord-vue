<template>
  <div class="harp-octave">
    <HarpButton v-if="!singleNote" :octave="octave" note="g" />
    <HarpButton v-if="!singleNote" :octave="octave" note="e" />
    <HarpButton :octave="octave" note="c" dot/>
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
    singleNote: Boolean,
  },
  inject: ["buttonTypes"],
};
</script>

<style scoped>
.harp-octave {
  /* display: inline-block; */
}
</style>
