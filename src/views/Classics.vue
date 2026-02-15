<script setup>
import { ref } from 'vue'
import classics from '../data/classics.js'

const expanded = ref({})

const toggle = (index) => {
    expanded.value[index] = !expanded.value[index]
}
</script>

<template>
    <div class="classics">
        <div v-for="(item, index) in classics" :key="index" class="section">
            <div class="section-title" @click="toggle(index)">
                <span class="arrow" :class="{ open: expanded[index] }">&#9654;</span>
                {{ item.title }}
            </div>
            <div v-if="expanded[index]" class="section-content">
                <template v-if="item.sections">
                    <div v-for="(sub, si) in item.sections" :key="si" class="subsection">
                        <div class="subsection-title">{{ sub.title }}</div>
                        <div class="subsection-content">{{ sub.content }}</div>
                    </div>
                </template>
                <template v-else>
                    <div class="content-text">{{ item.content }}</div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.classics {
    padding: 0.5em;
    max-width: 800px;
    margin: 0 auto;
}

.section {
    margin-bottom: 0.5em;
    border: 1px solid #d4c5a9;
    border-radius: 6px;
    overflow: hidden;
}

.section-title {
    padding: 0.8em;
    font-size: large;
    font-weight: bold;
    color: #5c4033;
    background: #f5f0e8;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.5em;
}

.section-title:active {
    background: #ebe5d9;
}

.arrow {
    font-size: 0.7em;
    transition: transform 0.2s;
    display: inline-block;
}

.arrow.open {
    transform: rotate(90deg);
}

.section-content {
    padding: 1em;
    font-size: medium;
    line-height: 1.8;
    color: #3c2f1e;
    white-space: pre-wrap;
    background: #fffcf5;
}

.subsection {
    margin-bottom: 1.5em;
}

.subsection:last-child {
    margin-bottom: 0;
}

.subsection-title {
    font-weight: bold;
    color: #8b6914;
    margin-bottom: 0.5em;
    font-size: medium;
}

.subsection-content {
    white-space: pre-wrap;
    line-height: 1.8;
}

.content-text {
    white-space: pre-wrap;
}
</style>
