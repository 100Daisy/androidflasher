<template>
    <o-steps :has-navigation=false v-model="activeStep">
      <main>
        <o-step-item step="1" label="Device">
          <SelectDevice @deviceIsConnected="checkUnlockState"/>
        </o-step-item>
        <o-step-item step="2" label="Unlock">
          <UnlockDevice @unlockCompleted="this.activeStep = 3" :manufacturer="manufacturer"/>
        </o-step-item>
        <o-step-item step="3" label="Files">
          <FlashConfigurator v-if="this.activeStep == 3" @flash="data => startFlashing(data)"/>
        </o-step-item>
        <o-step-item step="4" label="Install">
          <Flashing v-if="this.activeStep == 4" :data="flashDetails" />
        </o-step-item>
      </main>
    </o-steps>
</template>

<script>
import Swal from 'sweetalert2'
import UnlockDevice from './components/UnlockDevice.vue'
import SelectDevice from './components/SelectDevice.vue'
import FlashConfigurator from './components/FlashConfigurator.vue'
import Flashing from './components/Flashing.vue'

export default {
  components: {
    SelectDevice,
    UnlockDevice,
    FlashConfigurator,
    Flashing
},
  name: 'App',
  data() {
    return {
      activeStep: 1,
      showSocial: true,
      device: null,
      flashDetails: {},
    }
  },
  methods: {
    startFlashing(data) {
      this.activeStep = 4
      this.flashDetails = data
    },
    async checkUnlockState(device) {
      this.device = device
      this.manufacturer = device.device.manufacturerName
      device.getVariable('unlocked').then(async (unlocked) => {
        if (unlocked == 'no') {
          this.showSocial = true
          return
        }
        Swal.fire({
          title: 'Device unlocked ?',
          text: 'We are unable to detect device unlock state, make sure you have unlocked your device and proceed.',
          icon: 'question',
          confirmButtonText: 'Unlocked',
          denyButtonText: 'Help Me!',
          showDenyButton: true,
          reverseButtons: true
        }).then(async (result) => {
          if (result.isDenied) {
            this.showSocial = true
            this.activeStep = 2
            return
          }
          this.activeStep = 3
        })
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

:root { 
  --oruga-steps-active-color: #3DDB85;
  --oruga-steps-previous-color: #3DDB85;
  --oruga-input-max-width: 25%;
  --oruga-switch-margin-label: 0px;
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
  width: 70%;
}
.o-side__content {
  border-radius: 25px 0px 0px 25px;
}
</style>
