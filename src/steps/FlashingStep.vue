<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useDeviceStore } from '@/stores/devices';

import ProgressBar from '@/components/ProgressBar.vue';
import FlashLog from '@/components/FlashLog.vue';

const deviceStore = useDeviceStore();
const device = deviceStore.device;
const latestLine = ref('');
const progress = ref(0);

async function startFlashing() {
  progress.value = 0;
  if (deviceStore.package) {
    console.log(deviceStore.package)
    await device.flashFactoryZip(deviceStore.package, { skipSuperUpdate: deviceStore.skipSuperUpdate }, (action, item) => {
      console.log("received reconnect: " + action)
      latestLine.value = `Reconnecting to ${item}... ${action}`;
    }, (action, item, p) => {
      switch (action) {
        case 'unpack':
            latestLine.value = `Unpacking ${item}`;
            progress.value = p;
            break;
          case 'flash':
            latestLine.value = `Flashing ${item}`;
            progress.value = p;
            break;
          case 'reboot':
            latestLine.value = `Rebooting ${item}...`;
            progress.value = p;
          break;
      }
    })
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
      <ProgressBar :progress="progress" :parts="1" style="width: 80%;"/>
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

