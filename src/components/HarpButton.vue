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
  animation: brightness-out 0.5s ease forwards;
}

.harp-button[pressed="true"] {
  animation: brightness-in 0.5s ease forwards;
}

@keyframes brightness-in {
  0% {
    filter: saturate(70%) brightness(140%); /* same */
  }

  100% {
    filter: saturate(70%) brightness(140%); /* same */
  }
}

@keyframes brightness-out {
  0% {
    filter: saturate(70%) brightness(140%); /* same */
  }

  100% {
    filter: saturate(100%) brightness(100%); /* reset */
  }
}


.single-pad {
  position: relative;
  left: calc(var(--nth-last-index) * 1px);
  margin-top: 3px;
  margin-bottom: 3px;
  border-radius: 3px;
  background: linear-gradient(to right, #d8812a, #ebd493, #d8812a, #de9955);
  padding: 0;
  width: 120px;
  height: 3px;
}

.single-dot {
  top: -15px;
  right: 5px;
  margin-top: 3px;
  margin-bottom: 3px;
  border-radius: 3px;
  background: #de9955;
  padding: 0;
  width: 3px;
  height: 3px;
  float: left;
  position: relative;
}
</style>
