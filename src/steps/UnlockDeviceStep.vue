<script setup>
import Swal from 'sweetalert2';
import androidDevices from 'android-device-list';
import { useDeviceStore } from '@/stores/devices';

import UnlockMotorola from '@/unlockGuides/MotorolaGuide.vue';

const devices = [];
const deviceStore = useDeviceStore();

async function getUnlockTutorial() {
    const product = await window.device.getVariable('product');
    // choose last from the list of devices
    const deviceName = await androidDevices.getDevicesByDeviceId(product);
    // prepare list of devices
    if (deviceName.length > 0) {
        devices.value = deviceName.map((device) => device.name);
        const result = await Swal.fire({
            title: 'Multiple devices detected',
            text: 'Your product matches multiple devices, please choose one from the list',
            icon: 'question',
            input: 'select',
            inputOptions: devices.value,
            confirmButtonText: 'Choose',
        });
        if (result.isConfirmed) {
            const selectedDevice = devices.value[result.value];
            window.open(`https://www.google.com/search?q=how+to+unlock+bootloader+android+device+${selectedDevice}`, '_blank');
        }
    }
}

</script>

<template>
    <main>
        <UnlockMotorola v-if="deviceStore.manufacturer == 'Motorola Mobility LLC.'" @unlockCompleted="this.$emit('unlockCompleted', true)" id="test"/>
        <!-- <o-button @click="getUnlockTutorial()">I need more help</o-button> -->
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

#test {
    display: flex;
    align-items: stretch;
}
.o-btn {
    margin: 30px;
}
</style>
