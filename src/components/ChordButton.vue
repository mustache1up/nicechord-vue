<template>
  <div class="hello">
    <h1>{{ chord }} -> {{ variant }}</h1>
  </div>
</template>

<script>
export default {
  name: "ChordButton",
  components: {},
  props: {
    chord: String,
    variant: String,
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
