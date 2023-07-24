<script setup>
import { ref } from 'vue';
import * as fastboot from "android-fastboot";
import PatchConfiguratorStep from '../steps/PatchConfiguratorStep.vue';
import { useDeviceStore } from '../stores/devices';
import FlashingStep from '../steps/FlashingStep.vue';

const activeStep = ref(1);
const deviceStore = useDeviceStore();

async function selectDevice() {
  let fastbootDevice = new fastboot.FastbootDevice();
  await fastbootDevice.connect();
  return fastbootDevice;
};

function startFlash() {
  selectDevice().then((fastbootDevice) => {
    deviceStore.device = fastbootDevice;
    activeStep.value = 3;
  });
}
function startDownload() {
  console.log(deviceStore.flashObject)
  for (let i = 0; i < deviceStore.flashObject.files.length; i++) {
    const blob = new Blob([deviceStore.flashObject.files[i]], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = deviceStore.flashObject.files[i].filename
    link.click()
  }
}
</script>
<template>
    <o-steps :has-navigation=false v-model="activeStep" >
      <o-step-item step="1" label="Patch">
        <PatchConfiguratorStep @patch="activeStep = 2"/>
      </o-step-item>
      <o-step-item step="2" label="ChooseAction">
        <o-button @click="startDownload()">Download</o-button>
        <o-button @click="startFlash()">Flash</o-button>
        <o-button disabled>Share</o-button>
      </o-step-item>
      <o-step-item step="3" v-if="activeStep == 3" label="Flash">
        <FlashingStep v-if="activeStep == 3" />
      </o-step-item>
      <o-step-item step="4" v-if="activeStep == 4" label="Share"></o-step-item>
    </o-steps>
    <!-- <o-upload @update:modelValue="patchVbmeta($event)" v-model="file">
      <o-button tag="a" variant="primary">
        <o-icon icon="upload"></o-icon>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
        <span v-else >Vbmeta Disable Verify</span>
      </o-button>
    </o-upload>
    <ProgressBar :progress="progress"/> -->
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
