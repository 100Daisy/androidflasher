<script setup>
import Swal from 'sweetalert2'

import { defineEmits } from "vue";
import { useDeviceStore } from "@/stores/devices";
import { useRoute } from 'vue-router'

import * as fastboot from "android-fastboot";

const emit = defineEmits(['deviceIsConnected']);

const deviceStore = useDeviceStore();
const repo = useRoute().query.repo

async function importFlashConfig(response, device) {
  try {
    response = await response.json()
  } catch {
    await Swal.fire({
      title: 'Error',
      text: "Repository will not be imported",
      icon: 'error',
      confirmButtonText: 'Ok'
    })
    return
  }
  console.log(response.devices)
  Object.keys(response.devices).forEach(element => {
    if (element == device) {
      console.log(response.devices[element])
      deviceStore.flashObject = response.devices[element]
    }
  });
  // iterate over object
  
}

async function selectDevice() {
  let response 
  if (repo) {
    const popup = await Swal.fire({
      title: 'Import repository?',
      text: 'Do you want to use the repository ' + repo + ' for this session?',
      icon: 'warning',
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      showDenyButton: true,
      reverseButtons: true
    })
    if (popup.isConfirmed) {
      try {
        response = await fetch(repo)
      } catch (error) {
        await Swal.fire({
          title: 'Error',
          text: "Repository will not be imported",
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    }
  }
  let fastbootDevice = new fastboot.FastbootDevice();
  await fastbootDevice.connect();
  deviceStore.device = fastbootDevice;
  deviceStore.manufacturer = fastbootDevice.device.manufacturerName;
  if (response) {
    await importFlashConfig(response, await fastbootDevice.getVariable('product'))
  }
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
