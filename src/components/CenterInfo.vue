<template>
  <div class="center-info">
    <div class="ci-title">紫微斗数命盘</div>
    <div class="ci-row">{{ genderLabel }}　{{ astrolabe.fiveElementsClass }}</div>
    <div class="ci-row">阳历：{{ astrolabe.solarDate }}</div>
    <div class="ci-row">阴历：{{ astrolabe.lunarDate }}</div>
    <div class="ci-row" v-if="fourPillars">
      四柱：<span class="pillar">{{ fourPillars.year }}</span>
      <span class="pillar">{{ fourPillars.month }}</span>
      <span class="pillar">{{ fourPillars.day }}</span>
      <span class="pillar">{{ fourPillars.hour }}</span>
    </div>
    <div class="ci-row">命主：{{ astrolabe.soul }}　身主：{{ astrolabe.body }}</div>
    <div class="ci-row">{{ astrolabe.zodiac }}　{{ astrolabe.sign }}</div>
    <div class="ci-divider"></div>

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

const genderLabel = computed(() => props.gender === '男' ? '阳男' : '阴女')

const yearlyInfo = computed(() => {
  if (!props.selYear || !props.horoscopeData?.yearly) return null
  return {
    stem: props.horoscopeData.yearly.heavenlyStem,
    branch: props.horoscopeData.yearly.earthlyBranch,
  }
})

const age = computed(() => props.horoscopeData?.age?.nominalAge || null)
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
.pillar { color: #c41e3a; font-weight: bold; margin-right: 4px; }
.ci-divider { border-top: 1px dotted #d4c5a9; margin: 4px 0; }
</style>
