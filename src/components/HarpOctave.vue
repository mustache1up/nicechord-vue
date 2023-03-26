<template>
  <div class="harp-octave" :style="'left: ' + (octave * 9) + 'px'" >
    <HarpButton
      v-if="!singleNote"
      :index="2"
      :octave="notes[2].octave"
      :note="notes[2].note"
    />
    <HarpButton
      v-if="!singleNote"
      :index="1"
      :octave="notes[1].octave"
      :note="notes[1].note"
    />
    <HarpButton
      :index="0" 
      :octave="notes[0].octave" 
      :note="notes[0].note" 
      dot />
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
    octave: Number,
    currentChordObj: Object,
    singleNote: Boolean,
  },
  inject: ["roots", "variations"],
  computed: {
    notes() {
      if (!this.currentChordObj.chord || !this.currentChordObj.variation) {
        return Array(3).fill({
          octave: -1,
          note: -1,
        });
      }
      var notes = [];
      var rootNoteNumber = this.roots[this.currentChordObj.chord].noteNumber;
      for (let i = 0; i < 3; i++) {
        var tonesToAdvance = parseInt(
          this.variations[this.currentChordObj.variation].harpTones[i],
          10
        );
        var noteBMN = (rootNoteNumber + tonesToAdvance) % 12;
        var noteOctave = (noteBMN <= 5 ? this.octave : this.octave - 1) - -4;
        notes[i] = {
          octave: noteOctave,
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
  position: relative;
  cursor: pointer;
  /* display: inline-block; */
}
</style>
