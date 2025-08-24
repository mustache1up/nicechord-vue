<template>
  <div class="harp-octave">
    <HarpButton
      v-if="!singleNote"
      :button-id="octaveId + ':' + 2"
      :harpNotesStatus="harpNotesStatus"
    />
    <HarpButton
      v-if="!singleNote"
      :button-id="octaveId + ':' + 1"
      :harpNotesStatus="harpNotesStatus"
    />
    <HarpButton
      :button-id="octaveId + ':' + 0"
      :harpNotesStatus="harpNotesStatus"
      dot />
  </div>
</template>

<script setup>
import HarpButton from "./HarpButton.vue";

defineProps({
  octaveId: Number,
  currentChordObj: Object,
  harpNotesStatus: Object,
  singleNote: Boolean,
});
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
