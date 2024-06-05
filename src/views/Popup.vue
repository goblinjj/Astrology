<script setup>
import { watchEffect, ref } from 'vue'

const props = defineProps(['modelValue'])
const title = ref('')
const curGong = ref('')
const gong = [
    '命宫', 
    '兄弟宫', 
    '夫妻宫', 
    '子女宫', 
    '财帛宫', 
    '疾厄宫', 
    '迁移宫', 
    '交友宫', 
    '官禄宫', 
    '田宅宫', 
    '福禄宫', 
    '父母宫', 
]

const emits = defineEmits(['update:modelValue'])

const hidden = () => {
    curGong.value = ''
    emits('update:modelValue', '')
}
</script>

<template>
    <div v-if="props.modelValue.title" class="frame">
        <div @click="hidden">x</div>
        <div>{{ props.modelValue.category.title }} -> {{ props.modelValue.title }}</div>
        <span v-for="g in gong" class="s" :class="{select: curGong === g}" @click="curGong = g">{{ g }}</span>
        <div class="text">
            {{ props.modelValue.all }}
        </div>
        <div class="text" v-if="props.modelValue[curGong]">
            {{ props.modelValue[curGong] }}
        </div>
    </div>
</template>

<style scoped>
.frame {
    width: 100vw;
    height: 100vh;
    background: white;
    position: absolute;
    top: 0;
    left: 0
}
.s {
    padding: 0.3em;
    width: 25%;
    display: inline-block;
}
.s.select {
    background: gray;
}
.text {
    padding: 0.5em;
    font-size: large;
}

</style>