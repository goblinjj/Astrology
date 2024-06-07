<script setup>
import { ref, defineProps } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import formatStar from '@/data/formatStar'
const props = defineProps(['gong'])

const gong = props.gong
const store = useLocalStorage(gong, []);

const isShow = () => {
    if (!store.value.length)
        return true;

    return false;
}
const showPop = ref(false);
const popup = () => {
    showPop.value = true;
}
const hiddenPop = () => {
    showPop.value = false;
}
const selectStar = (star) => {
    let index = store.value.indexOf(star);
    if (index >= 0){
        store.value.splice(index, 1)
    } else {
        store.value.push(star);
    }
}
const shengxiao = ['子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊', '申猴', '酉鸡', '戌狗', '亥猪'];
</script>

<template>
    <div @click="popup()">
        <div v-if="isShow()" style="text-decoration: underline;text-underline-offset: 5px;">添加星耀</div>
        <div v-else>
            <span v-for="s in store" class="s">{{ s }}</span>
        </div>
    </div>

    <div v-if="showPop">
        <div class="overlay" @click="hiddenPop()"></div>
        <div class="mainpop">
            <div v-if="gong == '命宫'">
                <div class="title">紫薇生肖</div>
                <div class="parent">
                    <span v-for="s in shengxiao" class="star" :class="{active: store.indexOf(s) >= 0}" @click="selectStar(s)">{{ s }}</span>
                </div>
            </div>
            <div v-for="(c, k) in formatStar" class="frame">
                <div class="title">{{ k }}</div>
                <div class="parent">
                    <span v-for="s in c" class="star" :class="{active: store.indexOf(s.title) >= 0}" @click="selectStar(s.title)">{{ s.title }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mainpop {
    position: fixed;  
    top: 50%;  
    left: 50%;  
    transform: translate(-50%, -50%);  
    width: 80%;  
    height: 50%;  
    background: white;
    overflow: auto;
    z-index: 11111; 
    border-radius: 10px;
    padding: 1em;
}
.overlay {
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background: rgba(0, 0, 0, 0.5); 
    z-index: 999; 
}
.active {
    background: cornflowerblue;
    color: white;
    border-radius: 10px;
}
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
    white-space: nowrap;
    margin-right: 0.3em;
}
.s {
    border-radius: 0.5em;
    background: cornflowerblue;
    color: white;
    display: inline-block;
    padding: 0.2em 0.4em;
    margin-right: 0.3em;
}
</style>