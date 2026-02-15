<template>
  <div class="center-info">
    <div class="ci-title">紫微斗数命盘</div>
    <div class="ci-row">{{ genderLabel }}　{{ astrolabe.fiveElementsClass }}</div>
    <div class="ci-row">阳历：{{ astrolabe.solarDate }}</div>
    <div class="ci-row">阴历：{{ astrolabe.lunarDate }}</div>
    <div class="ci-row pillars-row" v-if="fourPillars">
      <span class="pillar-label">四柱：</span>
      <div class="pillars-cols">
        <span class="pillar-col" :style="{ color: pillarColor(fourPillars.year) }">{{ fourPillars.year }}</span>
        <span class="pillar-col" :style="{ color: pillarColor(fourPillars.month) }">{{ fourPillars.month }}</span>
        <span class="pillar-col" :style="{ color: pillarColor(fourPillars.day) }">{{ fourPillars.day }}</span>
        <span class="pillar-col" :style="{ color: pillarColor(fourPillars.hour) }">{{ fourPillars.hour }}</span>
      </div>
    </div>
    <div class="ci-row">命主：{{ astrolabe.soul }}　身主：{{ astrolabe.body }}</div>
    <div class="ci-row">{{ astrolabe.zodiac }}　{{ astrolabe.sign }}</div>
    <!-- Date/Time Adjustor -->
    <div class="ci-adjust">
      <div class="adj-group" v-for="field in adjustFields" :key="field.key">
        <button class="adj-btn" @click="$emit('adjust', field.key, -1)">−</button>
        <span class="adj-label">{{ field.label }}</span>
        <button class="adj-btn" @click="$emit('adjust', field.key, 1)">+</button>
      </div>
    </div>

    <!-- Progressive Info Display -->
    <div class="ci-row ci-small" v-if="yearlyInfo">
      流年：{{ yearlyInfo.stem }}{{ yearlyInfo.branch }}年
      <span v-if="age">　虚岁{{ age }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  astrolabe: { type: Object, required: true },
  gender: { type: String, required: true },
  fourPillars: { type: Object, default: null },
  horoscopeData: { type: Object, default: null },
  selYear: { default: null },
})

defineEmits(['adjust'])

const adjustFields = [
  { key: 'year', label: '年' },
  { key: 'month', label: '月' },
  { key: 'day', label: '日' },
  { key: 'hour', label: '时' },
]
const genderLabel = computed(() => props.gender === '男' ? '阳男' : '阴女')

const yearlyInfo = computed(() => {
  if (!props.selYear || !props.horoscopeData?.yearly) return null
  return {
    stem: props.horoscopeData.yearly.heavenlyStem,
    branch: props.horoscopeData.yearly.earthlyBranch,
  }
})

const age = computed(() => props.horoscopeData?.age?.nominalAge || null)

// 五行 colors by heavenly stem
const WUXING_COLORS = {
  '甲': '#2e7d32', '乙': '#2e7d32', // 木 Wood - green
  '丙': '#c62828', '丁': '#c62828', // 火 Fire - red
  '戊': '#8d6e27', '己': '#8d6e27', // 土 Earth - brown
  '庚': '#b8860b', '辛': '#b8860b', // 金 Metal - gold
  '壬': '#1565c0', '癸': '#1565c0', // 水 Water - blue
}
function pillarColor(pillar) {
  return pillar ? (WUXING_COLORS[pillar[0]] || '#3c2415') : '#3c2415'
}
</script>

<style scoped>
.center-info {
  grid-row: 2 / 4;
  grid-column: 2 / 4;
  border: 1px solid #d4c5a9;
  padding: 8px;
  background: #fffcf5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 13px;
}
.ci-title { color: #8b2500; font-weight: bold; font-size: 1.2em; text-align: center; margin-bottom: 4px; }
.ci-row { color: #3c2415; margin: 2px 0; }
.ci-small { font-size: 0.9em; }
.pillars-row { display: flex; align-items: flex-start; gap: 4px; }
.pillar-label { white-space: nowrap; }
.pillars-cols {
  display: flex; flex-direction: row; gap: 4px;
}
.pillar-col {
  writing-mode: vertical-rl;
  text-orientation: upright;
  color: #c41e3a; font-weight: bold;
  letter-spacing: 2px; line-height: 1.2;
}
.ci-divider { border-top: 1px dotted #d4c5a9; margin: 4px 0; }

/* Date/Time Adjustor */
.ci-adjust {
  display: flex; flex-wrap: wrap; gap: 4px 8px; justify-content: center; align-items: center;
  padding: 4px 0; margin: 6px 0;
  border-top: 1px dotted #d4c5a9;
  border-bottom: 1px dotted #d4c5a9;
}
.adj-group {
  display: inline-flex; align-items: center; gap: 0;
  min-width: 38%;
  justify-content: center;
}
.adj-btn {
  background: none; border: none;
  color: #b8860b; cursor: pointer;
  font-size: 16px; font-weight: bold;
  width: 20px; height: 20px; padding: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  transition: all 0.15s;
  line-height: 1;
}
.adj-btn:hover { color: #8b2500; background: rgba(139,37,0,0.08); }
.adj-btn:active { background: rgba(139,37,0,0.18); }
.adj-label {
  font-size: 13px; color: #8b2500; font-weight: bold;
  user-select: none;
}
</style>
