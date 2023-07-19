<script setup>
import { ref } from 'vue';
import ProgressBar from './ProgressBar.vue';
import Swal from 'sweetalert2';
import FlashLog from './FlashLog.vue';
import disableVerifyVbmeta from 'vbmeta-disabler';
import { useDeviceStore } from '@/stores/devices';

const deviceStore = useDeviceStore();
const latestLine = ref('');
const progress = ref(0);
const data = deviceStore.flashObject;

async function startFlashing() {
  progress.value = 0;
  let curr_progress = -1;
  for (let i = 0; i < data.quantity; i++) {
    curr_progress++;
    await deviceStore.device.runCommand(`set_active:${data.files[i].slot}`);
    latestLine.value = `Flashing ${data.files[i].filename}...`;
    if (data.options.disableVerity && data.files[i].partition == 'vbmeta') {
      const vbmeta = await disableVerifyVbmeta(data.files[i].blob);
      await deviceStore.device.flashBlob(data.files[i].partition, vbmeta, (t) => {
        // take progress.value every iteration and add progress to it
        progress.value = curr_progress + t;
      })
      continue;
    }
    await deviceStore.device.flashBlob(data.files[i].partition, data.files[i].blob, (t) => {
      // take progress.value every iteration and add progress to it
      progress.value = curr_progress + t;
    })
  }
  if (data.options.cleanFlash) {
    latestLine.value = 'Erasing userdata...';
    await deviceStore.device.runCommand(`erase:userdata`);
  }
}

startFlashing().then(() => {
  Swal.fire({
    title: 'Flashing completed',
    text: 'Congratulations! You have successfully flashed your device!',
    icon: 'success',
    confirmButtonText: 'Reboot'
  }).then((result) => {
    if (result.isConfirmed) {
      deviceStore.device.reboot()
    }
  })
})

</script>

<template>
    <main>
      <o-icon icon="bolt" size="large" />
      <FlashLog :latest-line="latestLine" :opacity-decrease="0.3" :maxLines="6"/>
      <ProgressBar :progress="progress" :parts="data.quantity"/>
    </main>
</template>

<style scoped>
main {
  background-color: #f5f5f5;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
</style>

