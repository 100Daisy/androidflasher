<template>
  <section>
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
    <section id="fot">
      <footer>
        <span>
          Made with <o-icon icon="heart"/> by <a href="https://github.com/100Daisy" target="_blank">100Daisy</a>
        </span>
        <span id="icons">
          <o-icon clickable @click="redirect('https://paypal.me/100Daisy')" size="medium" pack="fab" icon="paypal"/>
          <o-icon clickable @click="redirect('https://www.patreon.com/100Daisy')" size="medium" pack="fab" icon="patreon"/>
          <o-icon clickable @click="redirect('https://github.com/100Daisy/androidflasher')" size="medium" pack="fab" icon="github"/>
        </span>
      </footer>
    </section>
  </section>
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
    redirect(url) {
      window.open(url, '_self')
    },
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
  /* margin: 20px; */
  height: 100%;
}
/* .o-icon {
  margin: 1em;
  flex: 1;
} */
.o-pag {
  padding: 20px 0px;
}

.o-table__root {
  /* height: 540px; */
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
