<script setup>
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import Panstar from './Panstar.vue';
import Pantext from './Pantext.vue';

const gong = [
    '命宫',
    '官禄宫',
    '财帛宫',
    '迁移宫',
    '父母宫',
    '兄弟宫',
    '夫妻宫',
    '子女宫',
    '交友宫',
    '福禄宫',
    '田宅宫',
    '疾厄宫',
];
const stars = ref([]);

const reset = () => {
    for (let v of gong) {
        const store = useLocalStorage(v, []);
        store.value = [];
    }
}
</script>

<template>
    <table class="table">
        <tr v-for="i in 24" :key="i">
            <template v-if="i % 2 !== 0">
                <td class="td" width="80px" style="text-align: center">{{ gong[(i - 1) / 2] }}</td>
                <td class="td">
                    <Panstar :gong="gong[(i - 1) / 2]"/>
                </td>
            </template>
            <td v-else class="td" colspan="2">
                <Pantext :gong="gong[i / 2 - 1]"/>
            </td>
        </tr>
    </table>
    <button class="button" @click="reset()">清空</button>
</template>

<style scoped>
.button {
  display: inline-block;
  font-size: 16px;
  padding: 10px 20px;
  margin: 10px 2px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: cornflowerblue;
  border: none;
  border-radius: 15px;
  box-shadow: 0 3px #999;
}

.button:hover {background-color: #6495ed}

.button:active {
  background-color: #6495ed;
  box-shadow: 0 1px #666;
  transform: translateY(4px);
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.th,
.td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

.th {
    background-color: #f2f2f2;
}
</style>