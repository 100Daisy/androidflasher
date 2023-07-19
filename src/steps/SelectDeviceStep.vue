<script setup>
import { defineEmits } from "vue";
import { useDeviceStore } from "@/stores/devices";
import * as fastboot from "android-fastboot";

const emit = defineEmits(['deviceIsConnected']);

const deviceStore = useDeviceStore();

async function selectDevice() {
  let fastbootDevice = new fastboot.FastbootDevice();
  await fastbootDevice.connect();
  deviceStore.device = fastbootDevice;
  emit('deviceIsConnected', true);
};
</script>

<template>
  <main>
      <img @click="selectDevice()" src="../assets/android_devices.svg">
      <p>Choose your device</p>
  </main>
</template>
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Narnoor&family=Tilt+Neon&display=swap');
main {
  align-items: center;
  flex-direction: column;
  background-color: #f5f5f5;
  border-radius: 25px;
  display: flex;
  justify-content: space-evenly;
}

img {
  width: 50%;
  max-width: 512px;
  height: auto;
  cursor: pointer;
}

p {
  margin: 0px;
  padding: 30px;
  color: #2c3e50;
  font-family: 'Narnoor', serif;
  font-weight: bold;
  font-size: 26px;
  border-radius: 25px;
  width: 100%;
}

h1 {
  margin: 0px;
  padding: 20px;
}
</style>
