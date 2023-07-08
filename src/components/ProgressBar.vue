<template>
    <div class="progress-bar">
        <div class="progress-bar__fill" :style="{ width: fillWidth }"></div>
    </div>
</template>

<script>
export default {
    name: 'ProgressBar',
    props: {
        progress: {
            type: Number,
            required: true,
        },
        parts: {
            type: Number,
            required: true,
            validator: (value) => value >= 0,
        },
    },
    computed: {
        fillWidth() {
            if (this.progress >= this.parts) {
                return '100%';
            } else {
                return (this.progress / this.parts) * 100 + '%';
            }
        },
    },
};
</script>

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
