<script setup>
import { ref } from 'vue'
import data from '@/data/index'
import pop from './Popup.vue'
console.log(data)

let stars = {};

for (var v of data) {
    let cTitle = v.category.title
    if (typeof stars[cTitle] === 'undefined') {
        stars[cTitle] = [];
    }
    stars[cTitle].push(v)
}

// category = [...new Set(category)];
console.log(stars)

const curTitle = ref({})

</script>

<template>
  <main>
    <div v-for="(c, k) in stars" class="frame">
        <div class="title">{{ k }}</div>
        <span v-for="s in c" class="star" @click="curTitle = s">{{ s.title }}</span>  
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
    white-space: nowrap
}
.star {
    padding: 0.5em;
    white-space: nowrap
}
</style>