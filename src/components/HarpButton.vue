<template>
  <div class="harp-button" :style="'left: ' + (index * 3) + 'px'" @mouseenter="play">
    <div>
      <div class="single-pad" style="left: 2px"></div>
      <div class="single-pad" style="left: 1px"></div>
      <div class="single-pad" style="left: 0px"></div>
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
    index: Number,
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
        if (this.octave < 0) {
          return;
        }

        this.buf = this.buffers[this.octave][this.note];

        if (!this.status.playing) {
          return;
        }

        const crossoverSeconds = 0.01

        this.stopSource(this.source, {
          fadeOutSeconds: crossoverSeconds
        });

        this.source = this.prepareNewBufferSource();

        this.startSource(this.source, {
          fadeInSeconds: crossoverSeconds,
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
        source.gainNode.gain.linearRampToValueAtTime(1.0, this.audioContext.currentTime + options.fadeInSeconds)
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
        fadeInSeconds: 0,
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
