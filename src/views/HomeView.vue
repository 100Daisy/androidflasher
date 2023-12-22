<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useDeviceStore } from '../stores/devices'

import UnlockDeviceStep from '../steps/UnlockDeviceStep.vue'
import SelectDeviceStep from '../steps/SelectDeviceStep.vue'
import FlashConfiguratorStep from '../steps/FlashConfiguratorStep.vue'
import FlashingStep from '../steps/FlashingStep.vue'

const activeStep = ref(1)
const deviceStore = useDeviceStore()

function redirect(url) {
  window.open(url, '_self')
}

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
    activeStep.value = 3
    return
  } else if (await askUnlockState()) {
    // Unlocked - User confirmed
    deviceStore.isUnlocked = true
    activeStep.value = 3
  } else {
    // Locked
    deviceStore.isUnlocked = false
    activeStep.value = 2
  }
}
</script>

<template>
  <section>
    <o-steps :has-navigation=false v-model="activeStep">
      <main>
        <o-step-item step="1" label="Device">
          <SelectDeviceStep @deviceIsConnected="checkUnlockState"/>
        </o-step-item>
        <o-step-item step="2" label="Unlock">
          <UnlockDeviceStep @unlockCompleted="activeStep = 3" :manufacturer="manufacturer"/>
        </o-step-item>
        <o-step-item step="3" label="Download">
          <FlashConfiguratorStep v-if="activeStep == 3" @flash="activeStep = 4"/>
        </o-step-item>
        <o-step-item step="4" label="Install">
          <FlashingStep v-if="activeStep == 4" />
        </o-step-item>
      </main>
    </o-steps>
    <section id="fot">
      <footer>
        <span>
          Made with <o-icon icon="heart"/>
        </span>
        <span id="icons">
          <o-icon clickable @click="redirect('https://paypal.me/100Daisy')" size="medium" pack="fab" icon="paypal"/>
          <o-icon clickable @click="redirect('https://t.me/GitDaisyShitposting')" size="medium" pack="fab" icon="telegram"/>
          <o-icon clickable @click="redirect('https://github.com/100Daisy/androidflasher')" size="medium" pack="fab" icon="github"/>
        </span>
      </footer>
    </section>
  </section>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

:root { 
  --oruga-steps-active-color: black;
  --oruga-steps-previous-color: black;
  --oruga-input-max-width: 25%;
  --oruga-switch-margin-label: 0px;
  --oruga-button-background-color: black;
  --oruga-switch-active-background-color: black;
  --oruga-tooltip-background-color: black;
  --oruga-steps-divider-color: black;
}

.o-steps__wrapper-vertical .o-steps__title {
  display: none;
}

.o-steps__wrapper-vertical{
    display: flex; align-items: center;
}

main {
  height: 900px;
  margin: auto;
  width: 90%;
}
.o-side__content {
  border-radius: 25px 0px 0px 25px;
}
.o-upl {
  height: 100%;
}
.o-pag {
  padding: 20px 0px;
}

.o-upl__draggable {
  display: flex;
  justify-content: center;
  align-items: center;
}
#fot {
  display: flex;
  justify-content: center;
  margin-top: 3.5%;
}

#icons {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  width: 100%;
}

#icons .o-icon {
  margin: 0px 15px;
  color: #d8d8d8;
}

a {
  text-decoration: none;
}

a:visited {
  color: black;
}
</style>
