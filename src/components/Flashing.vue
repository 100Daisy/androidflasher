<template>
    <main>
      <o-icon @click="startFlashing()" icon="flash" size="large" />
      <ProgressBar :progress="progress" :parts="data.quantity"/>
    </main>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import ProgressBar from './ProgressBar.vue';
// define files and data props
const props = defineProps({
    data: {
        type: Array,
        required: true,
    }
});

const progress = ref(0);

async function startFlashing() {
  progress.value = 0;
  let curr_progress = -1;
  for (let i = 0; i < props.data.quantity; i++) {
    curr_progress++;
    await window.device.runCommand(`set_active:${props.data.data[i].slot}`);
    await window.device.flashBlob(props.data.data[i].partition, props.data.files[i], (t) => {
      // take progress.value every iteration and add progress to it
      progress.value = curr_progress + t;
    })
  }
}
</script>

<style scoped>
main {
  background-color: #f5f5f5;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.o-icon {
  margin: 1em;
  flex: 1;
}
</style>

