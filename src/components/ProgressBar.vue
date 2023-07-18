<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['progress', 'parts']);

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
    width: 80%;
    height: 20px;
    background-color: #eee;
    border-radius: 25px;
    overflow: hidden;
    margin-bottom: 50px;
}

.progress-bar__fill {
    height: 100%;
    background-color: #3DDB85;
}
</style>
