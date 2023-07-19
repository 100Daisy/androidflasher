<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue'
import { useDeviceStore } from '../stores/devices';

const emit = defineEmits(['unlockCompleted'])
const activeStep = ref(1)
const unlockCode = ref('')

const deviceStore = useDeviceStore()

async function getUnlockData() {
    let unlockData = await deviceStore.device.runCommand('oem get_unlock_data')
    // remove first 10 characters in string
    unlockData.text = unlockData.text.substring(12)
    // strip /n from the string
    unlockData.text = unlockData.text.replace(/\n/g, '')
    activeStep.value = 2
    // copy unlockData to clipboard
    navigator.clipboard.writeText(unlockData.text)
}
function goToSite() {
    window.open('https://motorola-global-portal.custhelp.com/app/standalone/bootloader/unlock-your-device-a', '_blank')
    activeStep.value = 3
}

async function unlockWithCode() {
    deviceStore.device.runCommand(`oem unlock ${unlockCode.value}`)
    await Swal.fire({
        title: 'User interaction required',
        text: 'Look at your device and confirm the unlock process, your device will be wiped, reboot back to fastboot after wipe is done.',
        icon: 'warning',
        confirmButtonText: 'Done'
    })
    deviceStore.isUnlocked = true
    emit('unlockCompleted', true)

}

</script>

<template>
    <main>
        <o-steps :animated=false v-model="activeStep" :hasNavigation=false vertical>
            <o-step-item :step=1>
                <o-button href="google.com" @click="getUnlockData()">Get Unlock Data</o-button>
            </o-step-item>
            <o-step-item :step=2>
                <o-button @click="goToSite()">Visit Motorola Site</o-button>
                <p>Unlock data is already copied to your clipboard</p>
            </o-step-item>
            <o-step-item :step=3>
                <o-input v-model="unlockCode" />
                <o-button @click="unlockWithCode()">Unlock</o-button>
            </o-step-item>
        </o-steps>
    </main>
</template>

<style scoped>
p {
    color: black;
    background-color: bisque;
    padding: 10px;
    border-radius: 25px;
    margin: auto;
    width: 360px;
}

.o-btn {
    margin: 10px;
}

.o-input {
    align-items: center;
}

main {
  display: flex;
  justify-content: space-evenly;
}
</style>