<script setup>
import { ref, defineProps } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import formatStar from '@/data/formatStar'
const props = defineProps(['gong'])

const gong = props.gong
const store = useLocalStorage(gong, []);


const starText = (star) => {
    for (let k in formatStar) {
        for (let v of formatStar[k]) {
            if (v.title == star)
                return v[gong]
        }
    }
}
</script>

<template>
    <div>
        <div v-for="star in store" style="margin-bottom: 0.5em;">
            <font style="font-size: large;">{{ star }} : </font><span v-html="starText(star)"></span>
        </div>
    </div>
</template>

<style scoped>
</style>