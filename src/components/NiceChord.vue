<template>
  <div class="flex flex-row relative">
    <div id="chord-fieldset-container" class="knob">
      <Fieldset id="chord-fieldset" legend="chord">
        <b> {{ currentChordPrettyName }} </b>
      </Fieldset>
    </div>
    <div class="knob">
      <knob v-model="controls.chord.volume" :min="0.0" :max="10.0" :step="0.1" :maxFractionDigits="1" value-template="chord"
        valueColor="MediumTurquoise" rangeColor="SlateGray" textColor="MediumTurquoise" />
    </div>
    <div class="knob">
      <knob v-model="controls.harp.volume" :min="0.0" :max="10.0" :step="0.1" value-template="harp"
        valueColor="Red" rangeColor="SlateGray" textColor="Red" />
    </div>
  </div>
  <div class="flex flex-row relative" style="align-items:center;">
    <div id="chords">
      <ChordPlayer :currentChordObj="currentChordObj" />
      <ChordButtonLabelGroup />
      <ChordButtonGroup
        v-for="(value, key) in properties.roots"
        :key="key"
        :chord="key"
        :currentChordObj="currentChordObj"
      />
    </div>
    <div id="harp">
      <!-- <HarpOctave
        :octave="4"
        :currentChordObj="currentChordObj"
        single-note
      /> -->
      <HarpOctave
        :octave="3"
        :currentChordObj="currentChordObj"
      />
      <HarpOctave
        :octave="2"
        :currentChordObj="currentChordObj"
      />
      <HarpOctave
        :octave="1"
        :currentChordObj="currentChordObj"
      />
      <HarpOctave
        :octave="0"
        :currentChordObj="currentChordObj"
      />
    </div>
  </div>
</template>

<script>
import properties from "@/properties.js";
import mapping from "@/mapping.js";
import ChordPlayer from "@/components/ChordPlayer.vue";
import ChordButtonLabelGroup from "@/components/ChordButtonLabelGroup.vue";
import ChordButtonGroup from "@/components/ChordButtonGroup.vue";
import HarpOctave from "@/components/HarpOctave.vue";
import { computed } from "vue";

export default {
  name: "App",
  components: {
    ChordPlayer,
    ChordButtonGroup,
    ChordButtonLabelGroup,
    HarpOctave,
  },
  provide() {
    return {
      buttonTypes: computed(() => this.properties.buttonTypes),
      roots: computed(() => this.properties.roots),
      variations: computed(() => this.properties.variations),
      mapping: computed(() => this.mapping),
      currentChordObj: computed(() => this.currentChordObj),
      currentPressedKeys: computed(() => this.currentPressedKeys),
      buffers: computed(() => this.buffers),
      chordBuffers: computed(() => this.chordBuffers),
      controls: computed(() => this.controls),
      audioContext: this.audioContext,
    };
  },
  data() {
    return {
      baseUrl: import.meta.env.BASE_URL,
      properties,
      mapping,
      controls: {
        chord: {
          volume: 5,
        },
        harp: {
          volume: 5,
        }
      },
      pressedKeysStack: [],
      currentPressedKeys: {},
      buffers: [],
      chordBuffers: [],
      audioContext: new AudioContext(),
    };
  },
  created() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.fetchHarpSamples();
    this.fetchChordSamples();
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  },
  methods: {
    fetchChordSamples() {

      for(const variation in this.properties.variations) {
        this.chordBuffers[variation] = [];
        for (const root in this.properties.roots) {
          const sampleUrl =
            this.baseUrl +
            "audio/chords/variations/" +
            variation + 
            "/" +
            root +
            ".ogg";
          fetch(sampleUrl)
            .then((resp) => resp.arrayBuffer())
            .then((buf) => this.audioContext.decodeAudioData(buf))
            .then((decoded) => {
              this.chordBuffers[variation][root] = decoded;
              console.log(
                "INFO - sample '" + sampleUrl + "' loaded."
              )
            })
            .catch(() =>
              console.log(
                "WARN - sample '" + sampleUrl + "' not found or loaded."
              )
            );
        }
      }
    },
    fetchHarpSamples() {
      for (let octave = 3; octave < 8; octave++) {
        this.buffers[octave] = [];
        for (let note = 0; note < 12; note++) {
          const sampleUrl =
            this.baseUrl +
            "audio/harp/octave/" +
            octave +
            "/note/" +
            note +
            "/samples/0.ogg";
          fetch(sampleUrl)
            .then((resp) => resp.arrayBuffer())
            .then((buf) => this.audioContext.decodeAudioData(buf))
            .then((decoded) => {
              this.buffers[octave][note] = decoded;
            })
            .catch(() =>
              console.log(
                "WARN - sample '" + sampleUrl + "' not found or loaded."
              )
            );
        }
      }
    },
    handleKeyDown(event) {
      if (this.currentPressedKeys[event.code]) {
        return;
      }
      this.currentPressedKeys[event.code] = true;

      const mappingEntry = this.mapping[event.code];
      if (!mappingEntry) {
        return;
      }
      
      this.properties.roots[mappingEntry.chordName][mappingEntry.buttonType] = true;
      
      this.pressedKeysStack.push(event.code);
    },
    handleKeyUp(event) {
      this.currentPressedKeys[event.code] = false;
      
      const mappingEntry = this.mapping[event.code];
      if (!mappingEntry) {
        return;
      }
      
      this.properties.roots[mappingEntry.chordName][mappingEntry.buttonType] = false;
      
      this.pressedKeysStack.splice(this.pressedKeysStack.indexOf(event.code), 1);
    },
  },
  computed: {
    currentChordObj() {
      return {
        chord: this.currentChord,
        variation: this.currentVariation
      }
    },
    currentChord() {
      if (this.pressedKeysStack.length == 0) {
        return null;
      }

      const lastPressedKey = this.pressedKeysStack[this.pressedKeysStack.length - 1]

      return this.mapping[lastPressedKey].chordName;
    },
    currentChordPrettyName() {
      if (!this.currentChord || !this.currentVariation) {
        return "-";
      }
      const chordRoot = this.properties.roots[this.currentChord].display;
      const variation =
        this.properties.variations[this.currentVariation].display;
      return chordRoot + variation;
    },
    currentVariation() {
      if (!this.currentChord) {
        return null;
      }

      const maj = this.properties.roots[this.currentChord].maj;
      const min = this.properties.roots[this.currentChord].min;
      const maj7 = this.properties.roots[this.currentChord].maj7;

      if (maj && !min && !maj7) {
        return "maj";
      }

      if (!maj && min && !maj7) {
        return "min";
      }

      if (!maj && !min && maj7) {
        return "maj7";
      }

      if (maj && !min && maj7) {
        return "maj7p";
      }

      if (!maj && min && maj7) {
        return "min7";
      }

      if (maj && min && !maj7) {
        return "dim";
      }

      if (maj && min && maj7) {
        return "aug";
      }

      return null;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #87aece;
  /* margin-top: 60px; */
  cursor: default;
  user-select: none;
}
#chords {
  display: inline-block;
  padding-right: 3vw;
}
#harp {
  display: inline-block;
  padding-left: 3vw;
}
#current-chord-label {
  display: inline-block;
}
#current-chord {
  display: inline-block;
  padding-left: 10px;
  width: 40px;
}
.knob {
  display: inline-block;
  padding: 0 15px;
}
.knob .p-fieldset-legend   {
  padding: 10px !important;
}
.knob .p-fieldset-content   {
  font-size: xx-large !important;
  padding: 5px !important;
}
#chord-fieldset-container {
  position: relative;
  top: -30px;
}
#chord-fieldset {
  width: 145px;
}
.flex {
    display: flex;
}
.flex-row {
    flex-direction: row;
}
.relative {
    position: relative;
}
</style>

