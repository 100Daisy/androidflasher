<template>
  <div class="horizontal-text" :style="calcHeight()">
      <div class="line" v-for="(line, index) in displayLines" :key="index" :style="getLineStyles(index)">
        {{ line }}
      </div>
  </div>
</template>

<script>

export default {
  name: 'HorizontalText',
  props: {
    latestLine: {
      type: String,
      required: true
    },
    opacityDecrease: {
      type: Number,
      default: 0.1
    },
    maxLines: {
      type: Number,
      default: 5 // Set your desired default maximum number of lines
    }
  },
  data() {
    return {
      displayLines: []
    };
  },
  watch: {
    latestLine(newLine) {
      this.displayLines.unshift(newLine);
      if (this.displayLines.length > this.maxLines) {
        this.displayLines.pop();
      }
    }
  },
  methods: {
    calcHeight() {
      return {
        height: `${this.maxLines * 25}px`
      };
    },
    getLineStyles(index) {
      const opacity = 1 - index * this.opacityDecrease;
      return {
        opacity: opacity
      };
    }
  }
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