<template>
  <div ref="container" name="container" class="h-screen w-screen bg-gray-800 flex flex-col items-center justify-center" >
    <div ref="contained" name="contained" id="contained" class="p-2 text-center">
      <NiceChord ref="niceChord"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NiceChord from "./components/NiceChord.vue";

const container = ref(null);
const contained = ref(null);
const niceChord = ref(null);
const scale = ref(1);

const redimensiona = () => {
  const widthProportion = container.value.offsetWidth / contained.value.offsetWidth;
  const heightProportion = container.value.offsetHeight / contained.value.offsetHeight;
  scale.value = Math.min(widthProportion, heightProportion);
};

onMounted(() => {
  window.addEventListener("resize", redimensiona);
  redimensiona();
});

</script>

<style>
#contained {
  transform: scale(v-bind(scale));
}
</style>
