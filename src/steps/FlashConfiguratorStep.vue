<script setup>
import { ref, defineEmits } from 'vue'
import { useDeviceStore } from '@/stores/devices'
import { downloadFileWithProgress } from '@/utils/download'
import ProgressBar from '../components/ProgressBar.vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['flash'])

const progress = ref(0)
const deviceStore = useDeviceStore()


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
    emit('flash', true)
}
</script>

<template>
    <main>
      <o-icon icon="arrow-down" size="large" />
      <ProgressBar :progress="progress" :parts="1" style="width: 80%;"/>
      <o-button size="large" @click="startFlash()" :disabled="progress !== 1">Flash</o-button>
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
</style>

