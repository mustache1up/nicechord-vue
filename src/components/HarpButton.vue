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
  inject: ["buffers"],
  data() {
    return {
      source: {},
      status: {
        playing: false,
        started: 0
      },
      aCtx: {},
    };
  },
  mounted() {
    this.aCtx = new AudioContext();
  },
  watch: {
    note: {
      handler() {
        if (this.octave == 0) {
          return;
        }

        this.buf = this.buffers[this.octave][this.note];

        if (!this.status.playing) {
          return;
        }

        try {
          this.source.stop(0);
          this.source.onended = undefined
        } catch (error) {
          console.log(error);
          return;
        }

        this.source = this.aCtx.createBufferSource(); 
        this.source.buffer = this.buf;
        this.source.connect(this.aCtx.destination);
        this.source.start(0, this.aCtx.currentTime - this.status.started);
        const status = this.status;
        this.source.onended = function () {
          console.log("status.playing = false")
          status.playing = false;
        };
        console.log("status.playing = true")
        this.status.playing = true;
      },
      flush: "post",
    },
  },
  methods: {
    play() {
      if (this.octave == 0) {
        console.log("no chord select");
        return;
      }
      try {
        this.source = this.aCtx.createBufferSource();
        this.source.buffer = this.buf;
        this.source.connect(this.aCtx.destination);
        this.source.start(0);
        this.status.started = this.aCtx.currentTime;
        const status = this.status;
        this.source.onended = function () {
          console.log("status.playing = false")
          status.playing = false;
        };
        console.log("status.playing = true")
        this.status.playing = true;
      } catch {
        console.log(
          "nao foi possivel tocar a nota octave " +
            this.octave +
            ", note " +
            this.note
        );
      }
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
