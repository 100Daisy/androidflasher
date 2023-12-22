<script setup>
import { ref, defineEmits } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import { downloadFileWithProgress } from '@/utils/download'
import ProgressBar from '../components/ProgressBar.vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['flash'])

const data = ref([])
const slotToggle = ref('a')
const wipeToggle = ref(false)
const progress = ref(0)
const deviceStore = useDeviceStore()

wipeToggle.value = deviceStore.wipe

if (deviceStore.isABDevice) {
  deviceStore.device.getVariable("current-slot").then((slot) => {
    if (slot == "b") {
      slotToggle.value = "a"
    }
    else {
      slotToggle.value = "b"
    }
  })
}

if (deviceStore.package) {
  console.log(deviceStore.package)
  downloadFileWithProgress(deviceStore.package, (p) => {
    console.log(p)
    progress.value = p
  }).then((blob) => {
    deviceStore.package = blob
  }).catch((err) => {
    Swal.fire({
      title: 'Error',
      text: `An error occured while downloading the package.`,
      icon: 'error',
      confirmButtonText: 'Retry',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload()
      }
    })
  })
}

const startFlash = () => {
    deviceStore.flashObject = {
      files: data.value,
      options: {
        cleanFlash: wipeToggle.value,
        ab: slotToggle.value
      }
    }
    emit('flash', true)
}
</script>

<template>
    <main>
      <o-icon icon="arrow-down" size="large" />
      <ProgressBar :progress="progress" :parts="1" style="width: 80%;"/>


          <o-button size="large" @click="startFlash()" :disabled="progress !== 1">Flash</o-button>

        <o-field>
          <o-tooltip label="This will wipe your phone">
            <o-switch v-model="wipeToggle">Wipe Data</o-switch>
          </o-tooltip>
          <o-tooltip label="Choose between A or B slot" v-if="deviceStore.isABDevice">
            <o-switch v-model="slotToggle" true-value="b" false-value="a">A/B</o-switch>
          </o-tooltip>
      </o-field>
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

.o-switch {
  flex-direction: column;
  margin: 20px 20px;
}

.o-field {
  flex-grow: 0;
}
</style>

