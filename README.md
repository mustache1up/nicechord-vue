[![build && publish](https://github.com/mustache1up/nicechord-vue/actions/workflows/main.yml/badge.svg)](https://github.com/mustache1up/nicechord-vue/actions/workflows/main.yml)

# NiceChord

Eletric autoharp inspired digital instrument

## Roadmap

### Essentials

  - Chords
    - Three basic variation keys per chord
    - Key combinations variations
  - Harp
    - Chord variations
    - Changes in chords change current playing notes
  
### Extras

  - Effects (separated controls to Harp and Chords)
    - Tremolo
    - Slow Attack
    - Fast Decay
    
  - Video Game sound (8bit / BMO)
  - Tape effect (lower pitch)

  - Drumpads
  - Drum Looper 
  - Chord Looper

## Negative Scope

  - Rhythm

## Project setup

### Download dependencies
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## Hint: using yarn container instead of installing it
alias yarn='docker run -it -v "$PWD:/app" -w /app node:18-alpine yarn'
