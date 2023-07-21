<script setup>
import ProgressBar from '../components/ProgressBar.vue';
import { useDeviceStore } from '../stores/devices';
import { ref } from 'vue'
const device = useDeviceStore().device
const progress = ref()
function bootFromImage(file) {
    device.bootBlob(file, (e) => {
        this.progress = e
    })
}
</script>
<template>
  <o-field class="file">
    <o-upload @update:modelValue="bootFromImage($event)" v-model="file">
      <o-button tag="a" variant="primary">
        <o-icon icon="upload"></o-icon>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
        <span v-else >Click to upload</span>
      </o-button>
    </o-upload>
  </o-field>
  <ProgressBar :progress="progress"/>
</template>