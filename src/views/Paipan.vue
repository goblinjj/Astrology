<script setup>
import { ref, computed } from 'vue'
import { astro } from 'iztro'

const date = ref('')
const timeIndex = ref(0)
const gender = ref('男')
const astrolabe = ref(null)
const selectedPalace = ref(null)
const horoscopeData = ref(null)
const horoscopeDate = ref('')

const timeOptions = [
  { value: 0, label: '早子时 (23:00-00:00)' },
  { value: 1, label: '丑时 (01:00-03:00)' },
  { value: 2, label: '寅时 (03:00-05:00)' },
  { value: 3, label: '卯时 (05:00-07:00)' },
  { value: 4, label: '辰时 (07:00-09:00)' },
  { value: 5, label: '巳时 (09:00-11:00)' },
  { value: 6, label: '午时 (11:00-13:00)' },
  { value: 7, label: '未时 (13:00-15:00)' },
  { value: 8, label: '申时 (15:00-17:00)' },
  { value: 9, label: '酉时 (17:00-19:00)' },
  { value: 10, label: '戌时 (19:00-21:00)' },
  { value: 11, label: '亥时 (21:00-23:00)' },
  { value: 12, label: '晚子时 (00:00-01:00)' },
]

// Earthly branch to grid position mapping (CSS grid row/col, 1-indexed)
const branchGrid = {
  '巳': { row: 1, col: 1 },
  '午': { row: 1, col: 2 },
  '未': { row: 1, col: 3 },
  '申': { row: 1, col: 4 },
  '辰': { row: 2, col: 1 },
  '酉': { row: 2, col: 4 },
  '卯': { row: 3, col: 1 },
  '戌': { row: 3, col: 4 },
  '寅': { row: 4, col: 1 },
  '丑': { row: 4, col: 2 },
  '子': { row: 4, col: 3 },
  '亥': { row: 4, col: 4 },
}

function generate() {
  if (!date.value) return
  astrolabe.value = astro.withOptions({
    type: 'solar',
    dateStr: date.value,
    timeIndex: timeIndex.value,
    gender: gender.value,
    config: {
      yearDivide: 'exact',
      horoscopeDivide: 'exact',
    },
  })
  // Auto-generate horoscope for today
  const today = new Date()
  const y = today.getFullYear()
  const m = today.getMonth() + 1
  const d = today.getDate()
  horoscopeDate.value = `${y}-${m}-${d}`
  horoscopeData.value = astrolabe.value.horoscope(horoscopeDate.value)
  selectedPalace.value = null
}

function gridStyle(palace) {
  const pos = branchGrid[palace.earthlyBranch]
  if (!pos) return {}
  return {
    'grid-row': pos.row,
    'grid-column': pos.col,
  }
}

const fourPillars = computed(() => {
  if (!astrolabe.value) return null
  const cd = astrolabe.value.rawDates?.chineseDate
  if (!cd) return null
  return {
    year: cd.yearly ? cd.yearly[0] + cd.yearly[1] : '',
    month: cd.monthly ? cd.monthly[0] + cd.monthly[1] : '',
    day: cd.daily ? cd.daily[0] + cd.daily[1] : '',
    hour: cd.hourly ? cd.hourly[0] + cd.hourly[1] : '',
  }
})

function brightnessClass(b) {
  if (b === '庙' || b === '旺') return 'bright-good'
  if (b === '陷' || b === '不') return 'bright-bad'
  return 'bright-mid'
}

function mutagenClass(m) {
  if (m === '忌') return 'mutagen-ji'
  return 'mutagen'
}

function updateHoroscope() {
  if (!astrolabe.value || !horoscopeDate.value) return
  horoscopeData.value = astrolabe.value.horoscope(horoscopeDate.value)
}

function openPalace(palace) {
  selectedPalace.value = palace
}

function closePalace() {
  selectedPalace.value = null
}
</script>

<template>
  <div class="paipan-page">
    <!-- Input Form -->
    <div class="form-section">
      <h2 class="section-title">紫微斗数排盘</h2>
      <div class="form-row">
        <label>
          <span class="label-text">出生日期</span>
          <input type="date" v-model="date" class="form-input" />
        </label>
      </div>
      <div class="form-row">
        <label>
          <span class="label-text">出生时辰</span>
          <select v-model="timeIndex" class="form-input">
            <option v-for="t in timeOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </label>
      </div>
      <div class="form-row">
        <span class="label-text">性别</span>
        <label class="radio-label">
          <input type="radio" v-model="gender" value="男" /> 男
        </label>
        <label class="radio-label">
          <input type="radio" v-model="gender" value="女" /> 女
        </label>
      </div>
      <div class="form-row">
        <button class="btn-generate" @click="generate">排盘</button>
      </div>
    </div>

    <!-- Chart Display -->
    <div v-if="astrolabe" class="chart-section">
      <div class="chart-grid">
        <!-- 12 Palaces -->
        <div
          v-for="palace in astrolabe.palaces"
          :key="palace.index"
          class="palace-cell"
          :style="gridStyle(palace)"
          @click="openPalace(palace)"
        >
          <div class="palace-header">
            <span class="palace-name">{{ palace.name }}</span>
            <span v-if="palace.isBodyPalace" class="body-tag">身</span>
            <span class="palace-branch">{{ palace.heavenlyStem }}{{ palace.earthlyBranch }}</span>
          </div>
          <div class="palace-stars">
            <span
              v-for="star in palace.majorStars"
              :key="star.name"
              class="star-major"
            >
              {{ star.name }}
              <span v-if="star.brightness" :class="brightnessClass(star.brightness)" class="star-brightness">{{ star.brightness }}</span>
              <span v-if="star.mutagen" :class="mutagenClass(star.mutagen)" class="star-mutagen">{{ star.mutagen }}</span>
            </span>
          </div>
          <div class="palace-minor-stars">
            <span v-for="star in palace.minorStars" :key="star.name" class="star-minor">
              {{ star.name }}
              <span v-if="star.brightness" :class="brightnessClass(star.brightness)" class="star-brightness">{{ star.brightness }}</span>
              <span v-if="star.mutagen" :class="mutagenClass(star.mutagen)" class="star-mutagen">{{ star.mutagen }}</span>
            </span>
          </div>
          <div class="palace-adj-stars">
            <span v-for="star in palace.adjectiveStars" :key="star.name" class="star-adj">{{ star.name }}</span>
          </div>
          <div class="palace-decadal" v-if="palace.decadal">
            <span>{{ palace.decadal.range[0] }}-{{ palace.decadal.range[1] }}</span>
          </div>
        </div>

        <!-- Center Info -->
        <div class="center-info">
          <h3 class="center-title">命盘信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">阳历</span>
              <span class="info-value">{{ astrolabe.solarDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">阴历</span>
              <span class="info-value">{{ astrolabe.lunarDate }}</span>
            </div>
            <div class="info-item" v-if="fourPillars">
              <span class="info-label">四柱</span>
              <span class="info-value pillars">{{ fourPillars.year }} {{ fourPillars.month }} {{ fourPillars.day }} {{ fourPillars.hour }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">五行局</span>
              <span class="info-value">{{ astrolabe.fiveElementsClass }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">命主</span>
              <span class="info-value">{{ astrolabe.soul }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">身主</span>
              <span class="info-value">{{ astrolabe.body }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">生肖</span>
              <span class="info-value">{{ astrolabe.zodiac }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">星座</span>
              <span class="info-value">{{ astrolabe.sign }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Horoscope Section -->
      <div class="horoscope-section">
        <h3 class="section-title">运限查看</h3>
        <div class="form-row horoscope-row">
          <label>
            <span class="label-text">查看日期</span>
            <input type="date" v-model="horoscopeDate" class="form-input" @change="updateHoroscope" />
          </label>
        </div>
        <div v-if="horoscopeData" class="horoscope-info">
          <div class="horoscope-item" v-if="horoscopeData.decadal">
            <span class="horoscope-label">大限</span>
            <span class="horoscope-value">
              {{ horoscopeData.decadal.heavenlyStem }}{{ horoscopeData.decadal.earthlyBranch }}
              （{{ horoscopeData.decadal.name }}）
            </span>
            <span class="horoscope-mutagen" v-if="horoscopeData.decadal.mutagen?.length">
              四化：{{ horoscopeData.decadal.mutagen.join('、') }}
            </span>
          </div>
          <div class="horoscope-item" v-if="horoscopeData.yearly">
            <span class="horoscope-label">流年</span>
            <span class="horoscope-value">
              {{ horoscopeData.yearly.heavenlyStem }}{{ horoscopeData.yearly.earthlyBranch }}
              （{{ horoscopeData.yearly.name }}）
            </span>
            <span class="horoscope-mutagen" v-if="horoscopeData.yearly.mutagen?.length">
              四化：{{ horoscopeData.yearly.mutagen.join('、') }}
            </span>
          </div>
          <div class="horoscope-item" v-if="horoscopeData.monthly">
            <span class="horoscope-label">流月</span>
            <span class="horoscope-value">
              {{ horoscopeData.monthly.heavenlyStem }}{{ horoscopeData.monthly.earthlyBranch }}
              （{{ horoscopeData.monthly.name }}）
            </span>
          </div>
          <div class="horoscope-item" v-if="horoscopeData.daily">
            <span class="horoscope-label">流日</span>
            <span class="horoscope-value">
              {{ horoscopeData.daily.heavenlyStem }}{{ horoscopeData.daily.earthlyBranch }}
              （{{ horoscopeData.daily.name }}）
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Palace Detail Modal -->
    <div v-if="selectedPalace" class="modal-overlay" @click.self="closePalace">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            {{ selectedPalace.name }}
            <span v-if="selectedPalace.isBodyPalace" class="body-tag">身宫</span>
            <span class="palace-branch-lg">{{ selectedPalace.heavenlyStem }}{{ selectedPalace.earthlyBranch }}</span>
          </h3>
          <button class="modal-close" @click="closePalace">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-section" v-if="selectedPalace.majorStars.length">
            <h4>主星</h4>
            <div v-for="star in selectedPalace.majorStars" :key="star.name" class="detail-star">
              <span class="star-major">{{ star.name }}</span>
              <span v-if="star.brightness" :class="brightnessClass(star.brightness)" class="star-brightness">{{ star.brightness }}</span>
              <span v-if="star.mutagen" :class="mutagenClass(star.mutagen)" class="star-mutagen">{{ star.mutagen }}</span>
            </div>
          </div>
          <div class="detail-section" v-if="selectedPalace.minorStars.length">
            <h4>辅星</h4>
            <div v-for="star in selectedPalace.minorStars" :key="star.name" class="detail-star">
              <span class="star-minor-detail">{{ star.name }}</span>
              <span v-if="star.brightness" :class="brightnessClass(star.brightness)" class="star-brightness">{{ star.brightness }}</span>
              <span v-if="star.mutagen" :class="mutagenClass(star.mutagen)" class="star-mutagen">{{ star.mutagen }}</span>
            </div>
          </div>
          <div class="detail-section" v-if="selectedPalace.adjectiveStars.length">
            <h4>杂曜</h4>
            <div class="adj-list">
              <span v-for="star in selectedPalace.adjectiveStars" :key="star.name" class="star-adj-detail">{{ star.name }}</span>
            </div>
          </div>
          <div class="detail-section">
            <h4>长生十二神</h4>
            <span class="detail-text">{{ selectedPalace.changsheng12 }}</span>
          </div>
          <div class="detail-section">
            <h4>博士十二神</h4>
            <span class="detail-text">{{ selectedPalace.boshi12 }}</span>
          </div>
          <div class="detail-section" v-if="selectedPalace.decadal">
            <h4>大限</h4>
            <span class="detail-text">{{ selectedPalace.decadal.range[0] }} - {{ selectedPalace.decadal.range[1] }} 岁</span>
            <span class="detail-text">（{{ selectedPalace.decadal.heavenlyStem }}{{ selectedPalace.decadal.earthlyBranch }}）</span>
          </div>
          <div class="detail-section" v-if="selectedPalace.ages?.length">
            <h4>小限</h4>
            <span class="detail-text">{{ selectedPalace.ages.join('、') }} 岁</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paipan-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 0.5em;
}

.section-title {
  color: #8b2500;
  font-size: 1.3em;
  margin: 0.5em 0;
  padding-left: 0.5em;
  border-left: 3px solid #8b2500;
}

/* Form */
.form-section {
  background: #fffcf5;
  border: 1px solid #d4c5a9;
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
}

.form-row {
  margin: 0.6em 0;
  display: flex;
  align-items: center;
  gap: 0.8em;
}

.label-text {
  color: #3c2415;
  margin-right: 0.5em;
  min-width: 4.5em;
  display: inline-block;
}

.form-input {
  font-family: inherit;
  font-size: 1em;
  padding: 0.4em 0.6em;
  border: 1px solid #d4c5a9;
  border-radius: 6px;
  background: #faf6ef;
  color: #3c2415;
  flex: 1;
  max-width: 280px;
}

.radio-label {
  color: #3c2415;
  cursor: pointer;
}

.btn-generate {
  background: #8b2500;
  color: #fff;
  border: none;
  padding: 0.5em 2em;
  border-radius: 15px;
  font-size: 1.1em;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 3px rgba(139, 37, 0, 0.4);
}
.btn-generate:hover {
  background: #a02d00;
}
.btn-generate:active {
  box-shadow: 0 1px rgba(139, 37, 0, 0.4);
  transform: translateY(2px);
}

/* Chart Grid */
.chart-section {
  margin-top: 1em;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, auto);
  border: 2px solid #d4c5a9;
  background: #faf6ef;
}

.palace-cell {
  border: 1px solid #d4c5a9;
  padding: 0.3em;
  min-height: 100px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: background 0.15s;
}
.palace-cell:hover {
  background: rgba(184, 134, 11, 0.08);
}

.palace-header {
  display: flex;
  align-items: center;
  gap: 0.2em;
  margin-bottom: 0.2em;
  flex-wrap: wrap;
}

.palace-name {
  color: #8b2500;
  font-weight: bold;
  font-size: 0.9em;
}

.body-tag {
  background: #c41e3a;
  color: #fff;
  font-size: 0.65em;
  padding: 0 0.3em;
  border-radius: 3px;
  vertical-align: middle;
}

.palace-branch {
  color: #b8860b;
  font-size: 0.75em;
  margin-left: auto;
}

.palace-stars {
  margin-bottom: 0.15em;
}

.star-major {
  color: #3c2415;
  font-size: 1em;
  font-weight: bold;
  display: inline-block;
  margin-right: 0.3em;
}

.star-brightness {
  font-size: 0.7em;
  font-weight: normal;
  vertical-align: super;
}
.bright-good {
  color: #b8860b;
}
.bright-mid {
  color: #888;
}
.bright-bad {
  color: #c41e3a;
}

.star-mutagen {
  font-size: 0.7em;
  font-weight: bold;
  vertical-align: super;
}
.mutagen {
  color: #b8860b;
}
.mutagen-ji {
  color: #c41e3a;
}

.palace-minor-stars {
  margin-bottom: 0.1em;
}

.star-minor {
  color: #555;
  font-size: 0.78em;
  display: inline-block;
  margin-right: 0.2em;
}

.palace-adj-stars {
  margin-bottom: 0.1em;
}

.star-adj {
  color: #888;
  font-size: 0.7em;
  display: inline-block;
  margin-right: 0.15em;
}

.palace-decadal {
  margin-top: auto;
  font-size: 0.7em;
  color: #b8860b;
  text-align: right;
}

/* Center Info */
.center-info {
  grid-row: 2 / 4;
  grid-column: 2 / 4;
  border: 1px solid #d4c5a9;
  padding: 0.6em;
  display: flex;
  flex-direction: column;
  background: #fffcf5;
}

.center-title {
  color: #8b2500;
  font-size: 1em;
  text-align: center;
  margin: 0 0 0.4em;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3em;
}

.info-item {
  display: flex;
  gap: 0.3em;
  align-items: baseline;
}

.info-label {
  color: #b8860b;
  font-size: 0.8em;
  white-space: nowrap;
}

.info-value {
  color: #3c2415;
  font-size: 0.85em;
}
.info-value.pillars {
  letter-spacing: 0.1em;
}

/* Horoscope */
.horoscope-section {
  background: #fffcf5;
  border: 1px solid #d4c5a9;
  border-radius: 8px;
  padding: 1em;
  margin-top: 1em;
  margin-bottom: 1em;
}

.horoscope-row {
  margin-bottom: 0.6em;
}

.horoscope-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}

.horoscope-item {
  background: #faf6ef;
  border: 1px solid #d4c5a9;
  border-radius: 6px;
  padding: 0.5em 0.8em;
  flex: 1;
  min-width: 180px;
}

.horoscope-label {
  color: #8b2500;
  font-weight: bold;
  margin-right: 0.4em;
}

.horoscope-value {
  color: #3c2415;
}

.horoscope-mutagen {
  display: block;
  color: #c41e3a;
  font-size: 0.85em;
  margin-top: 0.2em;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #faf6ef;
  border: 1px solid #d4c5a9;
  border-radius: 10px;
  max-width: 420px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8em 1em;
  border-bottom: 1px solid #d4c5a9;
}

.modal-header h3 {
  color: #8b2500;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.palace-branch-lg {
  color: #b8860b;
  font-size: 0.8em;
  font-weight: normal;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5em;
  color: #3c2415;
  cursor: pointer;
  padding: 0 0.3em;
}

.modal-body {
  padding: 0.8em 1em;
}

.detail-section {
  margin-bottom: 0.8em;
}

.detail-section h4 {
  color: #b8860b;
  font-size: 0.85em;
  margin: 0 0 0.3em;
}

.detail-star {
  margin-bottom: 0.2em;
}

.star-minor-detail {
  color: #3c2415;
  font-size: 0.95em;
}

.adj-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
}

.star-adj-detail {
  color: #666;
  font-size: 0.85em;
  background: #f5f0e8;
  padding: 0.1em 0.4em;
  border-radius: 3px;
}

.detail-text {
  color: #3c2415;
  font-size: 0.9em;
  margin-right: 0.5em;
}
</style>
