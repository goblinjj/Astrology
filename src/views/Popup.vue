<script setup>
import { watchEffect, ref, onMounted } from 'vue'

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

const formatText = (text) => {
    return text.replace(/\/(.*?)\//g, (m, p1) => {
        return '<span style="color: red;">' + p1 + '</span>'
    })
}

const handleEsc = (event) => {
    if (event.key === 'Escape') {
        hidden();
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleEsc);
})
</script>

<template>
    <div v-if="props.modelValue.title" class="frame2">
        <div @click="hidden" style="text-align: right; padding: 0.5em"><img src="/close.png" style="width: 30px;"></div>
        <div class="title">{{ props.modelValue.category.title }} -> {{ props.modelValue.title }}</div>
        <div class="text" v-html="formatText(props.modelValue.all)" />

        <div class="all">
            <div class="text" style="margin-bottom: 2em; color: cornflowerblue;" v-if="props.modelValue[curGong]"
                v-html=formatText(props.modelValue[curGong]) />
            <span v-for="g in gong">
                <span v-if="props.modelValue[g]" class="s" :class="{ select: curGong === g }" @click="curGong = g">{{ g
                }}</span>
            </span>
        </div>
    </div>
</template>

<style scoped>
.frame2 {
    width: 100%;
    height: calc(100vh);
    background: white;
    position: fixed;
    top: 0;
    left: 0;
}

@media (min-width: 1024px) {
    /* .frame  {
    margin: 0 auto;
    max-width: 760px;
  } */
}

.title {
    font-size: x-large;
    padding: 0.3em;
}

.s {
    padding: 0.5em;
    width: 25%;
    display: inline-block;
    text-align: center;
}

.s.select {
    background: gray;
    color: white;
}

.text {
    padding: 0.5em;
    font-size: large;
    margin-top: 1.5em;
    max-height: 35%;
    overflow: auto;
}

.all {
    position: absolute;
    bottom: 5em;
    width: 100%;
}
</style>