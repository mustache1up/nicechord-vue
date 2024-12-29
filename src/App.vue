<template>
  <div class="container">
    <div 
      class="div-box" id="div-1" 
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchCancel"
      :class="{ active: isActive('div-1') }"
    >
      Div 1
    </div>
    <div 
      class="div-box" id="div-2" 
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchCancel"
      :class="{ active: isActive('div-2') }"
    >
      Div 2
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const touchStates = reactive({}); // stores touch id and the div it is currently interacting with

const handleTouchStart = (event) => {
  event.preventDefault();
  
  for (let i = 0; i < event.touches.length; i++) {
    const touch = event.touches[i];
    const touchId = touch.identifier;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    let currentDiv = element.id;

    touchStates[touchId] = currentDiv; // Update the touch state reactively
    console.log(`Touch started on Div ${currentDiv} with touch id ${touchId}`);
  }
};

const handleTouchMove = (event) => {
  event.preventDefault();

  for (let i = 0; i < event.touches.length; i++) {
    const touch = event.touches[i];
    const touchId = touch.identifier;

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    let currentDiv = element.id;

    if (currentDiv && currentDiv !== touchStates[touchId]) {
      console.log(`Touch ${touchId} moved from Div ${touchStates[touchId]} to Div ${currentDiv}`);
      touchStates[touchId] = currentDiv; // Update touch state reactively
    }
  }

  // console.log(touchStates)
};

const handleTouchEnd = (event) => {
  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const touchId = touch.identifier;
    console.log(`Touch ${touchId} ended`);
    delete touchStates[touchId]; // Remove touch state reactively
  }
};

const handleTouchCancel = (event) => {
  for (let i = 0; i < event.changedTouches.length; i++) {
    const touch = event.changedTouches[i];
    const touchId = touch.identifier;
    console.log(`Touch ${touchId} canceled`);
    delete touchStates[touchId]; // Remove touch state reactively
  }
};

const isActive = (div) => {
  return Object.values(touchStates).includes(div); // Check if any touch is associated with the given div
};
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
  height: 100vh;
  touch-action: none; /* Prevent default touch behavior */
}
.div-box {
  flex: 1;
  height: 100%;
  border: 1px solid black;
  transition: background-color 0.2s;
}
#div-1 {
  background-color: lightblue;
}
#div-2 {
  background-color: lightgreen;
}
.active {
  background-color: #ff9800 !important;
}
</style>
