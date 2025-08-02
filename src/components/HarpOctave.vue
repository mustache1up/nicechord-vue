<template>
  <div class="harp-octave">
    <HarpButton
      v-if="!singleNote"
      :button-id="octaveId + ':' + 2"
      :octave="notes[2].octave"
      :note="notes[2].note"
      :harpNotesStatus="harpNotesStatus"
    />
    <HarpButton
      v-if="!singleNote"
      :button-id="octaveId + ':' + 1"
      :octave="notes[1].octave"
      :note="notes[1].note"
      :harpNotesStatus="harpNotesStatus"
    />
    <HarpButton
      :button-id="octaveId + ':' + 0"
      :octave="notes[0].octave" 
      :note="notes[0].note" 
      :harpNotesStatus="harpNotesStatus"
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
    octaveId: Number,
    currentChordObj: Object,
    harpNotesStatus: Object,
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
        var noteOctave = (noteBMN <= 5 ? this.octaveId : this.octaveId - 1) - -4;
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
.harp-octave {
  left: calc(var(--nth-last-index) * 9px);
}
</style>
