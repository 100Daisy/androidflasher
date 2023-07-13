<template>
    <main>
      <o-icon icon="bolt" size="large" />
      <FlashLog :latest-line="latestLine" :opacity-decrease="0.3" :maxLines="6"/>
      <ProgressBar :progress="progress" :parts="data.quantity"/>
    </main>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import ProgressBar from './ProgressBar.vue';
import Swal from 'sweetalert2';
import FlashLog from './FlashLog.vue';
import disableVerifyVbmeta from 'vbmeta-disabler';
// define files and data props
const props = defineProps({
    data: {
        type: Array,
        required: true,
    }
});

const latestLine = ref('');
const progress = ref(0);
async function startFlashing() {
  progress.value = 0;
  let curr_progress = -1;
  for (let i = 0; i < props.data.quantity; i++) {
    curr_progress++;
    await window.device.runCommand(`set_active:${props.data.data[i].slot}`);
    latestLine.value = `Flashing ${props.data.files[i].name}...`;
    if (props.data.options.disableVerity && props.data.data[i].partition == 'vbmeta') {
      const vbmeta = await disableVerifyVbmeta(props.data.files[i]);
      await window.device.flashBlob(props.data.data[i].partition, vbmeta, (t) => {
        // take progress.value every iteration and add progress to it
        progress.value = curr_progress + t;
      })
      continue;
    }
    await window.device.flashBlob(props.data.data[i].partition, props.data.files[i], (t) => {
      // take progress.value every iteration and add progress to it
      progress.value = curr_progress + t;
    })
  }
  if (props.data.options.cleanFlash) {
    latestLine.value = 'Erasing userdata...';
    await window.device.runCommand(`erase:userdata`);
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
      window.device.reboot()
    }
  })
})

</script>

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

