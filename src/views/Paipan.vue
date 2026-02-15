<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { astro } from 'iztro'

import { TIME_OPTIONS, SCOPE_COLORS, gridStyle } from '../composables/usePaipanConstants'
import { useHoroscope } from '../composables/useHoroscope'
import PalaceCell from '../components/PalaceCell.vue'
import CenterInfo from '../components/CenterInfo.vue'
import HoroscopePanel from '../components/HoroscopePanel.vue'

const route = useRoute()
const router = useRouter()

// ===== Form State =====
const date = ref('')
const timeIndex = ref(0)
const gender = ref('男')
const astrolabe = ref(null)

// ===== Horoscope Composable =====
const {
  horoscopeData, selectedPalaceIdx,
  selDecadal, selYear, selMonth,
  fourPillars, derivedNames, flyingSihuaBg,
  decadalList, yearList, flowStarsByPalace,
  getStarMutagens, resetSelections, clickPalace,
  isSanfang, isSelected,
  selectDecadal, selectYear, selectMonth,
} = useHoroscope(astrolabe)

// ===== Methods =====
function generate() {
  if (!date.value) return
  astrolabe.value = astro.withOptions({
    type: 'solar',
    dateStr: date.value,
    timeIndex: timeIndex.value,
    gender: gender.value,
    config: { yearDivide: 'exact', horoscopeDivide: 'exact' },
  })
  resetSelections()
  // Update URL for sharing
  router.replace({ query: { date: date.value, time: String(timeIndex.value), gender: gender.value } })
}

// ===== Auto-generate from URL query params =====
// Usage: /?date=2026-02-15&time=0&gender=男
onMounted(() => {
  const q = route.query
  if (q.date) {
    date.value = q.date
    if (q.time !== undefined) timeIndex.value = parseInt(q.time) || 0
    if (q.gender) gender.value = q.gender
    generate()
  }
})

function getPalaceScopes(p) {
  return {
    decadal: selDecadal.value && horoscopeData.value?.decadal?.palaceNames
      ? horoscopeData.value.decadal.palaceNames[p.index] : '',
    yearly: selYear.value && horoscopeData.value?.yearly?.palaceNames
      ? horoscopeData.value.yearly.palaceNames[p.index] : '',
    monthly: selMonth.value && horoscopeData.value?.monthly?.palaceNames
      ? horoscopeData.value.monthly.palaceNames[p.index] : '',
  }
}
</script>

<template>
  <div class="paipan-page">
    <!-- Full Form -->
    <div class="form-section" v-if="!astrolabe">
      <h2 class="section-title">紫微斗数排盘</h2>
      <div class="form-row">
        <span class="label-text">出生日期</span>
        <input type="date" v-model="date" class="form-input" />
      </div>
      <div class="form-row">
        <span class="label-text">出生时辰</span>
        <select v-model="timeIndex" class="form-input">
          <option v-for="t in TIME_OPTIONS" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>
      <div class="form-row">
        <span class="label-text">性别</span>
        <label class="gender-toggle" :class="{ active: gender === '男' }">
          <input type="radio" v-model="gender" value="男" />♂ 男
        </label>
        <label class="gender-toggle" :class="{ active: gender === '女' }">
          <input type="radio" v-model="gender" value="女" />♀ 女
        </label>
      </div>
      <div class="form-row">
        <button class="btn-generate" @click="generate">排盘</button>
      </div>
    </div>

    <!-- Compact Form -->
    <div v-if="astrolabe" class="form-compact">
      <div class="fc-row">
        <input type="date" v-model="date" class="form-input-sm" />
        <select v-model="timeIndex" class="form-input-sm">
          <option v-for="t in TIME_OPTIONS" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>
      <div class="fc-row">
        <label class="gender-toggle" :class="{ active: gender === '男' }">
          <input type="radio" v-model="gender" value="男" />♂ 男
        </label>
        <label class="gender-toggle" :class="{ active: gender === '女' }">
          <input type="radio" v-model="gender" value="女" />♀ 女
        </label>
        <span class="fc-spacer"></span>
        <button class="btn-sm" @click="generate">排盘</button>
      </div>
    </div>

    <!-- Chart -->
    <div v-if="astrolabe" class="chart-section">
      <div class="chart-grid">
        <!-- 12 Palaces -->
        <PalaceCell
          v-for="p in astrolabe.palaces" :key="p.index"
          :palace="p"
          :isSelected="isSelected(p)"
          :isSanfang="isSanfang(p)"
          :flyingSihuaBg="flyingSihuaBg"
          :flowStars="flowStarsByPalace[p.index]"
          :derivedName="derivedNames[p.index] || ''"
          :getStarMutagens="getStarMutagens"
          :decadalPalaceName="getPalaceScopes(p).decadal"
          :yearlyPalaceName="getPalaceScopes(p).yearly"
          :monthlyPalaceName="getPalaceScopes(p).monthly"
          @click="clickPalace"
        />

        <!-- Center Info -->
        <CenterInfo
          :astrolabe="astrolabe"
          :gender="gender"
          :fourPillars="fourPillars"
          :horoscopeData="horoscopeData"
          :selYear="selYear"
        />
      </div>

      <!-- Horoscope Bottom Panel -->
      <HoroscopePanel
        :decadalList="decadalList"
        :yearList="yearList"
        :selDecadal="selDecadal"
        :selYear="selYear"
        :selMonth="selMonth"
        @select-decadal="selectDecadal"
        @select-year="selectYear"
        @select-month="selectMonth"
      />
    </div>
  </div>
</template>

<style scoped>
.paipan-page { max-width: 1080px; margin: 0 auto; padding: 0 0.3em; }

/* === Form === */
.form-section { background: #fffcf5; border: 1px solid #d4c5a9; border-radius: 8px; padding: 1em; margin-bottom: 1em; }
.section-title { color: #8b2500; font-size: 1.3em; margin: 0.5em 0; padding-left: 0.5em; border-left: 3px solid #8b2500; }
.form-row { margin: 0.6em 0; display: flex; align-items: center; gap: 0.8em; }
.label-text { color: #3c2415; min-width: 4.5em; }
.form-input { font-family: inherit; font-size: 1em; padding: 0.4em 0.6em; border: 1px solid #d4c5a9; border-radius: 6px; background: #faf6ef; color: #3c2415; flex: 1; max-width: 280px; }
.radio-label { color: #3c2415; cursor: pointer; }
.btn-generate { background: #8b2500; color: #fff; border: none; padding: 0.5em 2em; border-radius: 15px; font-size: 1.1em; font-family: inherit; cursor: pointer; }

/* Compact form */
.form-compact { display: flex; flex-direction: column; gap: 0.4em; padding: 0.4em; background: #fffcf5; border: 1px solid #d4c5a9; border-radius: 6px; margin-bottom: 0.5em; }
.fc-row { display: flex; align-items: center; gap: 0.4em; }
.fc-spacer { flex: 1; }
.form-input-sm { font-family: inherit; font-size: 0.85em; padding: 0.3em; border: 1px solid #d4c5a9; border-radius: 4px; background: #faf6ef; color: #3c2415; }
.gender-toggle {
  display: inline-flex; align-items: center; gap: 2px;
  padding: 0.25em 0.7em; border: 1px solid #d4c5a9; border-radius: 14px;
  font-size: 0.85em; color: #3c2415; cursor: pointer;
  background: #faf6ef; transition: all 0.15s;
}
.gender-toggle input { display: none; }
.gender-toggle:hover { border-color: #8b2500; }
.gender-toggle.active { background: #8b2500; color: #fff; border-color: #8b2500; }
.btn-sm { background: #8b2500; color: #fff; border: none; padding: 0.3em 1em; border-radius: 10px; font-family: inherit; cursor: pointer; font-size: 0.85em; }

/* === Chart Grid === */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, auto);
  border: 2px solid #8b2500;
  background: #faf6ef;
}
</style>
