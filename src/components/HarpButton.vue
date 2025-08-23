<template>
  <div name="harp-button" class="harp-button" :data-button-id="buttonId" :pressed="pressed">
  <!-- @mouseenter="play" -->
    <div name="tri-pad">
      <div name="single-pad" class="single-pad"></div>
      <div name="single-pad" class="single-pad"></div>
      <div name="single-pad" class="single-pad"></div>
    </div>
    <div>
      <div v-if="dot" class="single-dot"></div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';

const props = defineProps({
  buttonId: String,
  dot: Boolean,
  harpNotesStatus: Object,
});

const pressed = computed(() => {
  return props.harpNotesStatus[props.buttonId] || false;
});
</script>



<style scoped>
.harp-button {
  position: relative;
  left: calc(var(--nth-last-index) * 3px);
  cursor: pointer;
  width: 130px;
  /* display: inline-block; */
}
.harp-button[pressed="true"] .single-pad {
  transition: background-size 15s ease;
  background-position-x: 50%;
}

.single-pad {
  position: relative;
  left: calc(var(--nth-last-index) * 1px);
  margin-top: 3px;
  margin-bottom: 3px;
  border-radius: 3px;
  background: linear-gradient(to right, #d8812a, #f0dca6, #fff5d7);
  transition: background-position 1s ease;
  background-size: 200% 200%;
  padding: 0;
  width: 120px;
  height: 3px;
}
.single-dot {
  top: -15px;
  margin-top: 3px;
  margin-bottom: 3px;
  border-radius: 3px;
  background: linear-gradient(to right, #feba71, #ffe28c);
  padding: 0;
  width: 3px;
  height: 3px;
  float: right;
  position: relative;
}
</style>
