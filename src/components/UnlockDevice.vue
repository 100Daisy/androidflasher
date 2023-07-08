<template>
    <main>
        <UnlockMotorola v-if="manufacturer == 'Motorola Mobility LLC.'" @unlockCompleted="this.$emit('unlockCompleted', true)" id="test"/>
        <!-- <o-button @click="getUnlockTutorial()">I need more help</o-button> -->
    </main>
  </template>
  
<script>
import Swal from 'sweetalert2'
import UnlockMotorola from '../markdown/motorola.vue'
import androidDevices from 'android-device-list'
export default {
    name: 'SelectDevice',
    props: {
        manufacturer: {
            type: String,
            required: true
        }
    },
    components: {
        UnlockMotorola
    },
    methods: {
        async getUnlockTutorial() {
            const product = await window.device.getVariable('product')
            // choose last from the list of devices
            const deviceName = await androidDevices.getDevicesByDeviceId(product)
            // prepare list of devices
            if (deviceName.length > 0) {
                const devices = deviceName.map((device) => {
                    return device.name
                })
                await Swal.fire({
                    title: 'Multiple devices detected',
                    text: 'Your product matches multiple devices, please choose one from the list',
                    icon: 'question',
                    input: 'select',
                    inputOptions: devices,
                    confirmButtonText: 'Choose',
                }).then((result) => {
                    if (result.isConfirmed) {
                        const device = devices[result.value]
                        window.open(`https://www.google.com/search?q=how+to+unlock+bootloader+android+device+${device}`, '_blank')
                    }
                })
            }   
        }
    },
}
</script>
   
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Narnoor&family=Tilt+Neon&display=swap');
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
