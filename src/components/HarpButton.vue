<template>
  <div class="harp-button" @mouseenter="play">
    <div>
      <div class="single-pad"></div>
      <div class="single-pad"></div>
      <div class="single-pad"></div>
      <!-- oc {{ octave }} - note {{ note }} -->
    </div>
    <div>
      <div v-if="dot" class="single-dot"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HarpButton",
  props: {
    octave: Number,
    note: Number,
    dot: Boolean,
  },
  data() {
    return {
      source: {},
      buf: [],
      aCtx: {},
    };
  },
  mounted() {
    this.aCtx = new AudioContext();
    fetch("/harp/octave/" + this.octave + "/note/" + this.note + "/0.ogg") // can be XHR as well
      .then((resp) => resp.arrayBuffer())
      .then((buf) => this.aCtx.decodeAudioData(buf)) // can be callback as well
      .then((decoded) => {
        this.buf = decoded;
      })
      .then(() => this.prepareLoop());
  },
  methods: {
    play() {
      try {
        this.prepareLoop();
      } catch {
        console.log("");
      }

      try {
        this.source.start(0);
      } catch {
        console.log("");
      }
    },

    prepareLoop() {
      this.source = this.aCtx.createBufferSource();
      this.source.buffer = this.buf;
      this.source.loop = false;
      this.source.connect(this.aCtx.destination);
    },
  },
};
</script>

<style scoped>
.harp-button {
  cursor: pointer;
  width: 130px;
  /* display: inline-block; */
}

.harp-button:hover .single-pad {
  transition: background-size 15s ease;
  background-position-x: 50%;
}
.single-pad {
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
