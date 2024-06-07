<script setup>
import { ref } from 'vue'
import pop from './Popup.vue'
import formatStar from '@/data/formatStar'

const curTitle = ref({})
</script>

<template>
  <main style="margin: 0 auto; max-width: 760px">
    <div v-for="(c, k) in formatStar" class="frame">
        <div class="title">{{ k }}</div>
        <div class="parent">
            <span v-for="s in c" class="star" @click="curTitle = s">{{ s.title }}</span>  
        </div>
    </div>
    <pop v-model="curTitle"></pop>
  </main>
</template>

<style scoped>
.frame {
    padding: 0.5em;
}
.title {
    font-size: large;
    margin-bottom: 0.5em;
    white-space: nowrap;
}
.star {
    padding: 0.5em;
    display: inline-block;
    white-space: nowrap
}
</style>