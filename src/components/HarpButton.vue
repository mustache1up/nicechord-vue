<template>
  <div class="harp-button" @mouseenter="play">
    <div>
      <div class="single-pad"></div>
      <div class="single-pad"></div>
      <div class="single-pad"></div>
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
  inject: ["buffers", "audioContext", "controls"],
  data() {
    return {
      source: this.audioContext.createBufferSource(),
      crossoverSeconds: 0.01,
      status: {
        playing: false,
        started: 0
      },
    };
  },
  watch: {
    note: {
      handler() {
        if (this.octave < 0) {
          return;
        }

        try {
          this.buf = this.buffers[this.octave][this.note];
        } catch (e) {
          console.error("Buffer not found for octave:", this.octave, "note:", this.note);
          return;
        }

        if (!this.status.playing) {
          return;
        }

        this.stopSource(this.source, {
          fadeOutSeconds: this.crossoverSeconds
        });

        this.source = this.prepareNewBufferSource();

        this.startSource(this.source, {
          fadeInSeconds: this.crossoverSeconds,
          startPositionSeconds: this.audioContext.currentTime - this.status.started + 0.3
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
          fadeInSeconds: 0,
          startPositionSeconds: 0}) {
      if(options.fadeInSeconds) {
        source.gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);         
        source.gainNode.gain.linearRampToValueAtTime((this.controls.harp.volume / 10.0), this.audioContext.currentTime + options.fadeInSeconds)
      }
      source.start(0, options.startPositionSeconds);
    },
    stopSource(source, options={
          fadeOutSeconds: 0}) {
      if(options.fadeOutSeconds) {
        source.gainNode.gain.setValueAtTime(source.gainNode.gain.value, this.audioContext.currentTime); 
        source.gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + options.fadeOutSeconds);
      }
      source.stop(this.audioContext.currentTime + options.fadeOutSeconds + 0.1);
      source.onended = undefined;
    },
    play() {
      if (this.octave < 0) {
        console.log("no chord select");
        return;
      }

      if (this.status.playing) {
        this.stopSource(this.source, {fadeOutSeconds: 0.5})
      }

      this.source = this.prepareNewBufferSource();

      this.startSource(this.source, {
        fadeInSeconds: this.crossoverSeconds,
        startPositionSeconds: 0
      })

      this.status.started = this.audioContext.currentTime;
      this.status.playing = true;
    },
  },
};
</script>

<style scoped>
.harp-button {
  position: relative;
  left: calc(var(--nth-last-index) * 3px);
  cursor: pointer;
  width: 130px;
  /* display: inline-block; */
}
.harp-button:hover .single-pad {
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
