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
                <td class="td td-gong" width="80px">{{ gong[(i - 1) / 2] }}</td>
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
  background-color: #8b2500;
  border: none;
  border-radius: 15px;
  box-shadow: 0 3px rgba(139, 37, 0, 0.4);
}

.button:hover { background-color: #a02d00 }

.button:active {
  background-color: #a02d00;
  box-shadow: 0 1px rgba(139, 37, 0, 0.4);
  transform: translateY(4px);
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.th,
.td {
    border: 1px solid #d4c5a9;
    text-align: left;
    padding: 8px;
}

.td-gong {
    text-align: center;
    background: #f5f0e8;
}

.th {
    background-color: #f5f0e8;
}
</style>
