export default {
  buttonLines: [
    "maj",
    "min",
    "maj7",
  ],

  roots: {
    db: {
      display: "Db",
      noteNumber: 1
    },
    ab: {
      display: "Ab",
      noteNumber: 8
    },
    eb: {
      display: "Eb",
      noteNumber: 3
    },
    bb: {
      display: "Bb",
      noteNumber: 10
    },
    f: {
      display: "F",
      noteNumber: 5
    },
    c: {
      display: "C",
      noteNumber: 0
    },
    g: {
      display: "G",
      noteNumber: 7
    },
    d: {
      display: "D",
      noteNumber: 2
    },
    a: {
      display: "A",
      noteNumber: 9
    },
    e: {
      display: "E",
      noteNumber: 4
    },
    b: {
      display: "B",
      noteNumber: 11
    },
    fs: {
      display: "F#",
      noteNumber: 6
    }
  },

  variations: {
    maj: {
      display: "",
      harpTones: [0, 4, 7]
    },
    min: {
      display: "m",
      harpTones: [0, 3, 7]
    },
    maj7: {
      display: "7",
      harpTones: [0, 4, 10]
    },
    maj7p: {
      display: "7+",
      harpTones: [0, 4, 11]
    },
    min7: {
      display: "m7",
      harpTones: [0, 3, 10]
    },
    dim: {
      display: "dim",
      harpTones: [0, 3, 6]
    },
    aug: {
      display: "aug",
      harpTones: [0, 4, 8]
    }
  },

  combinations: {
    0b100: "maj",
    0b010: "min",
    0b001: "maj7",
    0b101: "maj7p",
    0b011: "min7",
    0b110: "dim",
    0b111: "aug"
  }
};
