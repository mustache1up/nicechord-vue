<template>
  <div>
    
  </div>
</template>

<script>
export default {
  name: "ChordPlayer",
  props: {
    currentChordObj: Object,
  },
  inject: ["roots", "chordBuffers", "audioContext", "controls"],
  data() {
    return {
      source: this.audioContext.createBufferSource(),
      status: {
        playing: false,
        started: 0
      },
    }
  },
  watch: {
    currentChordObj: {
      handler(newCurrentChordObj) {

        const crossoverSeconds = 0.01

        if (!newCurrentChordObj.chord || !newCurrentChordObj.variation) {
          // when chord memory is off stop current chord if any 
          this.stopSource(this.source, {
            fadeOutSeconds: crossoverSeconds
          });
          this.status.playing = false;
          return;
        }

        if(this.status.playing) {
          this.stopSource(this.source, {
            fadeOutSeconds: crossoverSeconds
          });
        }

        this.buf = this.chordBuffers[newCurrentChordObj.variation][newCurrentChordObj.chord];

        this.source = this.prepareNewBufferSource();

        this.startSource(this.source, {
          fadeInSeconds: crossoverSeconds,
          startPositionSeconds: 0 // this.audioContext.currentTime - this.status.started + 0.3
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
      // const status = this.status;
      // source.onended = function () {
      //   status.playing = false;
      // };
      return source;
    },
    startSource(source, options={
          fadeInSeconds: 0,
          startPositionSeconds: 0}) {
      if(options.fadeInSeconds) {
        source.gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);         
        source.gainNode.gain.linearRampToValueAtTime((this.controls.chord.volume / 10.0), this.audioContext.currentTime + options.fadeInSeconds)
      }
      source.loop = true;
      source.start(0, options.startPositionSeconds);
    },
    stopSource(source, options={
          fadeOutSeconds: 0}) {
      if(options.fadeOutSeconds) {
        source.gainNode.gain.setValueAtTime(source.gainNode.gain.value, this.audioContext.currentTime); 
        source.gainNode.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + options.fadeOutSeconds);
      }
      // source.stop(this.audioContext.currentTime + options.fadeOutSeconds + 0.1);
      source.stop();
      source.onended = undefined;
    },
    // play() {
    //   // if (this.octave == 0) {
    //   //   console.log("no chord select");
    //   //   return;
    //   // }
    //
    //   // if (this.status.playing) {
    //   //   this.stopSource(this.source, {fadeOutSeconds: 0.5})
    //   // }
    //
    //   this.source = this.prepareNewBufferSource();
    //
    //   this.startSource(this.source, {
    //     fadeInSeconds: 0,
    //     startPositionSeconds: 0
    //   })
    //
    //   // this.status.started = this.audioContext.currentTime;
    //  // this.status.playing = true;
    // },
  },
};
</script>

<style scoped>
</style>
