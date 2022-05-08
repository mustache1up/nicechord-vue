<template>
  <div class="chord-button">{{ buttonType }}</div>
</template>

<script>
export default {
  name: "ChordButton",
  props: {
    buttonType: String,
  },
};
</script>

<style scoped>
.chord-button {
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 6px;
  color: antiquewhite;
  font-weight: bold;
  height: 30px;
  width: 50px;
  text-align: right;
  padding-top: 15px;
  padding-bottom: 0px;
}
</style>
