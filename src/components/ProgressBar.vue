<script setup>
import { ref, computed } from 'vue';
//  set default for parts
const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  parts: {
    type: Number,
    default: 1
  }
});

const fillWidth = computed(() => {
  if (props.progress >= props.parts) {
    return '100%';
  } else {
    return (props.progress / props.parts) * 100 + '%';
  }
});
</script>

<template>
  <div class="progress-bar">
      <div class="progress-bar__fill" :style="{ width: fillWidth }"></div>
  </div>
</template>

<style>
.progress-bar {
    width: 100%;
    height: 20px;
    background-color: #eee;
    border-radius: 25px;
    overflow: hidden;
}

.progress-bar__fill {
    height: 100%;
    background-color: #3DDB85;
}
</style>
