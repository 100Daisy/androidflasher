<template>
  <div class="horizontal-text" :style="calcHeight()">
      <div class="line" v-for="(line, index) in displayLines" :key="index" :style="getLineStyles(index)">
        {{ line }}
      </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  latestLine: {
    type: String,
    required: true,
  },
  opacityDecrease: {
    type: Number,
    default: 0.1,
  },
  maxLines: {
    type: Number,
    default: 5,
  },
});

const displayLines = ref([]);
watch(() => props.latestLine, (newLine) => {
  displayLines.value.unshift(newLine);
  if (displayLines.value.length > props.maxLines) {
    displayLines.value.pop();
  }
});

const calcHeight = () => {
  return {
    height: `${props.maxLines * 25}px`,
  };
};

const getLineStyles = (index) => {
  const opacity = 1 - index * props.opacityDecrease;
  return {
    opacity,
  };
};
</script>


<style scoped>
.horizontal-text {
  text-align: justify;
}

.line {
  line-height: 25px;
}
</style>