<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2';
import SelectDeviceStep from '../steps/SelectDeviceStep.vue'
import BootImageStep from '../steps/BootImageStep.vue'

import { useDeviceStore } from '../stores/devices';

const deviceStore = useDeviceStore()
const activeStep = ref()
async function askUnlockState() {
  const result = await Swal.fire({
      title: 'Device unlocked?',
      text: 'We are unable to detect the device unlock state, make sure you have unlocked your device and proceed.',
      icon: 'question',
      confirmButtonText: 'Unlocked',
      denyButtonText: 'Help Me!',
      showDenyButton: true,
      reverseButtons: true
    })
  if (result.isDenied) {
    return false
  }
  return true
}

async function checkUnlockState() {
  const unlocked = await deviceStore.device.getVariable('unlocked') === 'yes' ? true : false;
  if (unlocked) {
    // Unlocked - Auto detected
    deviceStore.isUnlocked = true
    activeStep.value = 2
    return
  } else if (await askUnlockState()) {
    // Unlocked - User confirmed
    deviceStore.isUnlocked = true
    activeStep.value = 2
  } else {
    // Locked
    deviceStore.isUnlocked = false
  }
}
</script>
<template>
  <o-steps :has-navigation=false v-model="activeStep">
    <main>
      <o-step-item step="1" label="Device">
        <SelectDeviceStep @deviceIsConnected="checkUnlockState"/>
      </o-step-item>
      <o-step-item step="2" label="Boot">
        <BootImageStep v-if="activeStep == 2" />
      </o-step-item>
    </main>
  </o-steps>
</template>
