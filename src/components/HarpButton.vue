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
  inject: ["buffers", "audioContext"],
  data() {
    return {
      source: this.audioContext.createBufferSource(),
      status: {
        playing: false,
        started: 0
      },
    };
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

        stop(this.source);

        this.source = this.prepareNewBufferSource();

        this.startSource(this.source, {
          attackTime: 0.01,
          startPosition: this.audioContext.currentTime - this.status.started
        })

        this.status.playing = true;
      },
      flush: "post",
    },
  },
  methods: {
    prepareNewBufferSource() {
      const source = this.audioContext.createBufferSource();
      source.gainNode = this.audioContext.createGain();
      source.buffer = this.buf;
      source.connect(source.gainNode);
      source.gainNode.connect(this.audioContext.destination);
      const status = this.status;
      source.onended = function () {
        status.playing = false;
      };
      return source;
    },
    startSource(source, options={
          attackTime: 0,
          startPosition: 0}) {
      if(options.attackTime) {
        source.gainNode.gain.value = 0.00001
        source.gainNode.gain.exponentialRampToValueAtTime(1.0, this.audioContext.currentTime + options.attackTime)
      }
      source.start(0, options.startPosition);
    },
    stop(source) {
      source.gainNode.gain.linearRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.01);
      source.stop(this.audioContext.currentTime + 0.1);
      source.onended = undefined;
    },
    play() {
      if (this.octave == 0) {
        console.log("no chord select");
        return;
      }

      if (this.status.playing) {
        stop(this.source)
      }

      this.source = this.prepareNewBufferSource();

      this.startSource(this.source, {
        attackTime: 0,
        startPosition: 0
      })

      this.status.started = this.audioContext.currentTime;
      this.status.playing = true;
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
