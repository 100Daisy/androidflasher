<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import disableVerifyVbmeta from 'vbmeta-disabler';
import * as fastboot from "android-fastboot";
import ProgressBar from '../components/ProgressBar.vue';

const progress = ref(0);

async function selectDevice() {
  let fastbootDevice = new fastboot.FastbootDevice();
  await fastbootDevice.connect();
  return fastbootDevice;
};

async function patchVbmeta(vbmeta) {
    const patchedVbmeta = await disableVerifyVbmeta(vbmeta)
    Swal.fire({
        title: 'Patched vbmeta',
        text: 'Patched vbmeta is ready to be flashed',
        icon: 'success',
        showDenyButton: true,
        reverseButtons: true,
        confirmButtonText: 'Flash',
        denyButtonText: 'Download',
    }).then( async (result) => {
        if (result.isConfirmed) {
            selectDevice().then((fastbootDevice) => {
              console.log(fastbootDevice)
              console.log(patchedVbmeta)
              fastbootDevice.flashBlob('vbmeta', patchedVbmeta , (t) => {
                progress.value = t;
              });
            });
        } else {
            const blob = new Blob([patchedVbmeta], { type: 'application/octet-stream' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'vbmeta.img'
            link.click()
        }
    })
}
</script>
<template>
  <main>
    <o-upload @update:modelValue="patchVbmeta($event)" v-model="file">
      <o-button tag="a" variant="primary">
        <o-icon icon="upload"></o-icon>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
        <span v-else >Vbmeta Disable Verify</span>
      </o-button>
    </o-upload>
    <ProgressBar :progress="progress"/>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
