<template>
  <div class="chord-button">{{ buttonLine }}</div>
</template>

<script>
export default {
  name: "ChordButton",
  props: {
    buttonLine: Number,
  },
};
</script>

<style scoped>
.chord-button {
  position: relative;
  left: calc(var(--nth-index) * 6px);
  margin-top: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 6px;
  color: antiquewhite;
  font-weight: bold;
  height: 45px;
  width: 30px;
  text-align: right;
  padding-top: 15px;
  padding-bottom: 0px;
}
</style>
