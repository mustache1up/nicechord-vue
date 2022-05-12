<template>
  <div class="harp-octave">
    <HarpButton
      v-if="!singleNote"
      :octave="notes[2].octave"
      :note="notes[2].note"
    />
    <HarpButton
      v-if="!singleNote"
      :octave="notes[1].octave"
      :note="notes[1].note"
    />
    <HarpButton :octave="notes[0].octave" :note="notes[0].note" dot />
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
  computed: {
    notes() {
      var notes = [];
      var rootAsNumber = 2; // TODO
      for (let i = 0; i < 3; i++) {
        var tonesToAdvance = parseInt(
          this.variations[this.variation].harpTones[i],
          10
        ); // TODO
        var noteBMN = (rootAsNumber + tonesToAdvance) % 12;
        var noteOctave = noteBMN <= 5 ? this.octave : this.octave - 1;
        notes[i] = {
          octave: +noteOctave + 4,
          note: noteBMN,
        };
      }
      return notes;
    },
  },
};
</script>

<style scoped>
.harp-octave {
  cursor: pointer;
  /* display: inline-block; */
}
</style>
