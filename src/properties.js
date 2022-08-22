export default {
  buttonTypes: {
    maj: {},
    min: {},
    maj7: {}
  },

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

  // keyCombos: {
  //   {
  //     maj: true,
  //     min: false,
  //     maj7: false,
  //   }: "",
  //   {
  //     maj: false,
  //     min: true,
  //     maj7: false,
  //   }: "",
  //   {
  //     maj: false,
  //     min: false,
  //     maj7: true,
  //   }: "",
  //   {
  //     maj: true,
  //     min: true,
  //     maj7: true,
  //   }: "",
  //   {
  //     maj: true,
  //     min: true,
  //     maj7: true,
  //   }: "",
  //   {
  //     maj: true,
  //     min: true,
  //     maj7: true,
  //   }: "",
  //   {
  //     maj: true,
  //     min: true,
  //     maj7: true,
  //   }: "" 
  // }
};
