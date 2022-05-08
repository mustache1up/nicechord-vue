<template>
  <div class="chord-group">
    <div class="chord-title"></div>
    <ChordButtonLabel
      v-for="(value, key) in buttonTypes"
      :key="key"
      :button-type="key"
    />
  </div>
</template>

<script>
import ChordButtonLabel from "./ChordButtonLabel.vue";
export default {
  name: "ChordButtonLabelGroup",
  components: {
    ChordButtonLabel,
  },
  inject: ["buttonTypes"],
};
</script>

<style scoped>

.chord-title {
  color:antiquewhite;
  font-weight: bold;
}
.chord-group {
  display: inline-block;
  margin-left: 3px;
  margin-right: 3px;
}
</style>
