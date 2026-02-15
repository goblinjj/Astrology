<script setup>
import { ref, computed } from 'vue'
import { astro } from 'iztro'

// ===== Constants =====
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const PALACE_SEQ = ['命','兄','夫','子','财','疾','迁','友','官','田','福','父']
const PALACE_SHORT = {
  '命宫':'命','兄弟':'兄','夫妻':'夫','子女':'子','财帛':'财','疾厄':'疾',
  '迁移':'迁','交友':'友','仆役':'友','官禄':'官','田宅':'田','福德':'福','父母':'父',
}
const MUTAGEN_LABELS = ['禄','权','科','忌']
const MUTAGEN_COLORS = { '禄':'#009900', '权':'#cc6600', '科':'#6633cc', '忌':'#cc0000' }

const SIHUA_TABLE = {
  '甲': ['廉贞','破军','武曲','太阳'],
  '乙': ['天机','天梁','紫微','太阴'],
  '丙': ['天同','天机','文昌','廉贞'],
  '丁': ['太阴','天同','天机','巨门'],
  '戊': ['贪狼','太阴','右弼','天机'],
  '己': ['武曲','贪狼','天梁','文曲'],
  '庚': ['太阳','武曲','太阴','天同'],
  '辛': ['巨门','太阳','文曲','文昌'],
  '壬': ['天梁','紫微','左辅','武曲'],
  '癸': ['破军','巨门','太阴','贪狼'],
}

const TIME_OPTIONS = [
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

const BRANCH_GRID = {
  '巳':{r:1,c:1},'午':{r:1,c:2},'未':{r:1,c:3},'申':{r:1,c:4},
  '辰':{r:2,c:1},'酉':{r:2,c:4},
  '卯':{r:3,c:1},'戌':{r:3,c:4},
  '寅':{r:4,c:1},'丑':{r:4,c:2},'子':{r:4,c:3},'亥':{r:4,c:4},
}

const MONTH_NAMES = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
const DAY_NAMES = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十']
const HOUR_NAMES = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时']

// ===== State =====
const date = ref('')
const timeIndex = ref(0)
const gender = ref('男')
const astrolabe = ref(null)
const selectedPalaceIdx = ref(null)

// Horoscope
const horoscopeData = ref(null)
const selDecadal = ref(null)
const selYear = ref(null)
const selMonth = ref(1)
const selDay = ref(1)
const selHour = ref(0)

// Scroll refs
const decadalScrollRef = ref(null)
const yearScrollRef = ref(null)

// ===== Helpers =====
function bIdx(b) { return BRANCHES.indexOf(b) }
function yearSB(y) {
  return STEMS[((y-4)%10+10)%10] + BRANCHES[((y-4)%12+12)%12]
}
function gridStyle(palace) {
  const g = BRANCH_GRID[palace.earthlyBranch]
  return g ? { 'grid-row': g.r, 'grid-column': g.c } : {}
}
function bClass(b) {
  if (b === '庙' || b === '旺') return 'b-good'
  if (b === '陷' || b === '不') return 'b-bad'
  return 'b-mid'
}
function mutagenColor(m) { return MUTAGEN_COLORS[m] || '#3c2415' }

// ===== Computed =====
const birthYear = computed(() => {
  if (!astrolabe.value) return 0
  return parseInt(astrolabe.value.solarDate.split('-')[0])
})

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

// 三方四正: set of branch indices
const sanfangSet = computed(() => {
  if (selectedPalaceIdx.value === null || !astrolabe.value) return new Set()
  const p = astrolabe.value.palaces[selectedPalaceIdx.value]
  const b = bIdx(p.earthlyBranch)
  return new Set([b, (b+4)%12, (b+8)%12, (b+6)%12])
})

// Derived palace names: "X之Y" format
const derivedNames = computed(() => {
  if (selectedPalaceIdx.value === null || !astrolabe.value) return {}
  const selP = astrolabe.value.palaces[selectedPalaceIdx.value]
  const selBi = bIdx(selP.earthlyBranch)
  const selShort = PALACE_SHORT[selP.name] || selP.name[0]
  const result = {}
  astrolabe.value.palaces.forEach(p => {
    const offset = (selBi - bIdx(p.earthlyBranch) + 12) % 12
    if (p.index !== selectedPalaceIdx.value) {
      result[p.index] = selShort + '之' + PALACE_SEQ[offset]
    }
  })
  return result
})

// Flying 四化 from clicked palace's 天干
const flyingSihua = computed(() => {
  if (selectedPalaceIdx.value === null || !astrolabe.value) return {}
  const p = astrolabe.value.palaces[selectedPalaceIdx.value]
  const stars = SIHUA_TABLE[p.heavenlyStem]
  if (!stars) return {}
  const result = {}
  stars.forEach((starName, i) => {
    try {
      const star = astrolabe.value.star(starName)
      const sp = star?.palace()
      if (sp) {
        if (!result[sp.index]) result[sp.index] = []
        result[sp.index].push({
          label: MUTAGEN_LABELS[i],
          color: MUTAGEN_COLORS[MUTAGEN_LABELS[i]],
          star: starName,
          isSelf: sp.index === selectedPalaceIdx.value,
        })
      }
    } catch(e) { /* star not found */ }
  })
  return result
})

// Decadal list sorted by age
const decadalList = computed(() => {
  if (!astrolabe.value) return []
  return astrolabe.value.palaces
    .filter(p => p.decadal)
    .map(p => ({
      palaceIdx: p.index,
      range: p.decadal.range,
      stem: p.decadal.heavenlyStem,
      branch: p.decadal.earthlyBranch,
      name: p.name,
    }))
    .sort((a, b) => a.range[0] - b.range[0])
})

// Year list for selected decade
const yearList = computed(() => {
  if (!selDecadal.value || !birthYear.value) return []
  const [s, e] = selDecadal.value.range
  return Array.from({ length: e - s + 1 }, (_, i) => {
    const age = s + i
    const yr = birthYear.value + age - 1
    return { year: yr, age, sb: yearSB(yr) }
  })
})

// Flow 四化 from horoscope (大限 + 流年)
const horoscopeFlying = computed(() => {
  if (!horoscopeData.value || !astrolabe.value) return {}
  const result = {}
  for (const [scope, prefix] of [['decadal','限'],['yearly','年']]) {
    const data = horoscopeData.value[scope]
    if (!data?.mutagen) continue
    data.mutagen.forEach((starName, i) => {
      try {
        const star = astrolabe.value.star(starName)
        const palace = star?.palace()
        if (palace) {
          if (!result[palace.index]) result[palace.index] = []
          result[palace.index].push({
            label: prefix + MUTAGEN_LABELS[i],
            color: MUTAGEN_COLORS[MUTAGEN_LABELS[i]],
          })
        }
      } catch(e) {}
    })
  }
  return result
})

// Flow stars from horoscope per palace
const flowStarsByPalace = computed(() => {
  if (!horoscopeData.value) return {}
  const result = {}
  for (const scope of ['decadal', 'yearly']) {
    const data = horoscopeData.value[scope]
    if (!data?.stars) continue
    const prefix = scope === 'decadal' ? '限' : '年'
    data.stars.forEach((stars, idx) => {
      if (!stars?.length) return
      if (!result[idx]) result[idx] = []
      stars.forEach(s => {
        result[idx].push({
          name: prefix + (s.name.length > 2 ? s.name.slice(-2) : s.name),
          mutagen: s.mutagen,
          scope,
        })
      })
    })
  }
  return result
})

// Horoscope derived palace names (大命, 年兄 etc)
const horoscopePalaceLabels = computed(() => {
  if (!horoscopeData.value) return {}
  const result = {}
  for (const [scope, prefix] of [['decadal','大'],['yearly','年']]) {
    const data = horoscopeData.value[scope]
    if (!data?.palaceNames) continue
    data.palaceNames.forEach((name, idx) => {
      if (!result[idx]) result[idx] = []
      const short = PALACE_SHORT[name] || name[0]
      result[idx].push(prefix + short)
    })
  }
  return result
})

// Flow year ages per palace
const flowYearAges = computed(() => {
  if (!astrolabe.value || !birthYear.value) return {}
  const birthBi = ((birthYear.value - 4) % 12 + 12) % 12
  const result = {}
  astrolabe.value.palaces.forEach(p => {
    const pbi = bIdx(p.earthlyBranch)
    const first = ((pbi - birthBi + 12) % 12) || 12
    const ages = []
    for (let a = first; a <= 100; a += 12) ages.push(a)
    result[p.index] = ages
  })
  return result
})

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
  selectedPalaceIdx.value = null
  selDecadal.value = null
  selYear.value = null
  horoscopeData.value = null
  autoSelectCurrent()
}

function autoSelectCurrent() {
  const today = new Date()
  const currentYear = today.getFullYear()
  const age = currentYear - birthYear.value + 1
  const decade = decadalList.value.find(d => age >= d.range[0] && age <= d.range[1])
  if (decade) {
    selDecadal.value = decade
  } else if (decadalList.value.length) {
    selDecadal.value = decadalList.value[0]
  }
  selYear.value = currentYear
  selMonth.value = today.getMonth() + 1
  selDay.value = today.getDate()
  selHour.value = 0
  updateHoroscope()
}

function clickPalace(idx) {
  selectedPalaceIdx.value = selectedPalaceIdx.value === idx ? null : idx
}

function isSanfang(palace) {
  return sanfangSet.value.has(bIdx(palace.earthlyBranch))
}
function isSelected(palace) {
  return selectedPalaceIdx.value === palace.index
}

function selectDecadal(d) {
  selDecadal.value = d
  const firstYr = birthYear.value + d.range[0] - 1
  const lastYr = birthYear.value + d.range[1] - 1
  if (!selYear.value || selYear.value < firstYr || selYear.value > lastYr) {
    selYear.value = firstYr
  }
  updateHoroscope()
}
function selectYear(y) { selYear.value = y.year; updateHoroscope() }
function selectMonth(m) { selMonth.value = m; updateHoroscope() }
function selectDay(d) { selDay.value = d; updateHoroscope() }
function selectHour(h) { selHour.value = h; updateHoroscope() }

function updateHoroscope() {
  if (!astrolabe.value || !selYear.value) return
  const dateStr = `${selYear.value}-${selMonth.value}-${selDay.value}`
  try {
    horoscopeData.value = astrolabe.value.horoscope(dateStr, selHour.value)
  } catch(e) { console.warn('Horoscope error:', e) }
}

function scrollRight(ref) {
  ref?.scrollBy({ left: 200, behavior: 'smooth' })
}
</script>

<template>
  <div class="paipan-page">
    <!-- Full form before generation -->
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
        <label class="radio-label"><input type="radio" v-model="gender" value="男" /> 男</label>
        <label class="radio-label"><input type="radio" v-model="gender" value="女" /> 女</label>
      </div>
      <div class="form-row">
        <button class="btn-generate" @click="generate">排盘</button>
      </div>
    </div>

    <!-- Compact form after generation -->
    <div v-if="astrolabe" class="form-compact">
      <input type="date" v-model="date" class="form-input-sm" />
      <select v-model="timeIndex" class="form-input-sm">
        <option v-for="t in TIME_OPTIONS" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>
      <label class="radio-sm"><input type="radio" v-model="gender" value="男" />男</label>
      <label class="radio-sm"><input type="radio" v-model="gender" value="女" />女</label>
      <button class="btn-sm" @click="generate">排盘</button>
    </div>

    <!-- Chart -->
    <div v-if="astrolabe" class="chart-section">
      <div class="chart-grid">
        <!-- 12 Palaces -->
        <div
          v-for="p in astrolabe.palaces" :key="p.index"
          class="palace-cell"
          :class="{ 'is-selected': isSelected(p), 'is-sanfang': !isSelected(p) && isSanfang(p) }"
          :style="gridStyle(p)"
          @click="clickPalace(p.index)"
        >
          <!-- Major Stars -->
          <div class="star-row major-row">
            <span v-for="s in p.majorStars" :key="s.name" class="star-col">
              <span class="sname major-name">{{ s.name }}</span>
              <span class="sbright" :class="bClass(s.brightness)">{{ s.brightness || '' }}</span>
              <span v-if="s.mutagen" class="smut" :style="{ color: mutagenColor(s.mutagen) }">{{ s.mutagen }}</span>
            </span>
          </div>
          <!-- Minor Stars -->
          <div class="star-row minor-row">
            <span v-for="s in p.minorStars" :key="s.name" class="star-col">
              <span class="sname minor-name">{{ s.name }}</span>
              <span class="sbright" :class="bClass(s.brightness)">{{ s.brightness || '' }}</span>
              <span v-if="s.mutagen" class="smut" :style="{ color: mutagenColor(s.mutagen) }">{{ s.mutagen }}</span>
            </span>
          </div>
          <!-- Adjective Stars -->
          <div class="star-row adj-row">
            <span v-for="s in p.adjectiveStars" :key="s.name" class="sadj">{{ s.name }}</span>
          </div>

          <!-- Flying 四化 from clicked palace (only when clicked) -->
          <div v-if="flyingSihua[p.index]" class="flying-labels">
            <span v-for="f in flyingSihua[p.index]" :key="f.label + f.star"
              class="fly-tag" :class="{ 'fly-self': f.isSelf }"
              :style="{ color: f.color, borderColor: f.isSelf ? f.color : 'transparent' }">
              {{ f.isSelf ? '自化' + f.label : f.star + '化' + f.label }}
            </span>
          </div>

          <!-- Flow stars from horoscope -->
          <div v-if="flowStarsByPalace[p.index]" class="flow-stars">
            <span v-for="s in flowStarsByPalace[p.index]" :key="s.name"
              class="flow-star" :class="'scope-' + s.scope">
              {{ s.name }}
              <span v-if="s.mutagen" class="smut" :style="{ color: mutagenColor(s.mutagen) }">{{ s.mutagen }}</span>
            </span>
          </div>

          <!-- Horoscope flying 四化 labels -->
          <div v-if="horoscopeFlying[p.index]" class="h-flying">
            <span v-for="f in horoscopeFlying[p.index]" :key="f.label"
              class="h-fly-tag" :style="{ color: f.color }">{{ f.label }}</span>
          </div>

          <!-- Horoscope palace labels (大命, 年兄) -->
          <div v-if="horoscopePalaceLabels[p.index]" class="h-palace-labels">
            <span v-for="l in horoscopePalaceLabels[p.index]" :key="l" class="h-plabel">{{ l }}</span>
          </div>

          <!-- Derived name when palace clicked -->
          <div v-if="derivedNames[p.index]" class="derived-label">{{ derivedNames[p.index] }}</div>

          <!-- Bottom info -->
          <div class="palace-bottom">
            <div class="pb-left">
              <span class="cs12">{{ p.changsheng12 }}</span>
              <span class="decadal-range" v-if="p.decadal">{{ p.decadal.range[0] }}~{{ p.decadal.range[1] }}</span>
            </div>
            <div class="pb-right">
              <span class="p-name">{{ p.name }}</span>
              <span v-if="p.isBodyPalace" class="body-tag">身</span>
              <span class="p-branch">{{ p.heavenlyStem }}{{ p.earthlyBranch }}</span>
            </div>
          </div>
        </div>

        <!-- Center Info -->
        <div class="center-info">
          <div class="ci-title">紫微斗数命盘</div>
          <div class="ci-row">{{ gender === '男' ? '阳男' : '阴女' }}　{{ astrolabe.fiveElementsClass }}</div>
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
          <div class="ci-row ci-small" v-if="horoscopeData?.yearly">
            流年：{{ horoscopeData.yearly.heavenlyStem }}{{ horoscopeData.yearly.earthlyBranch }}年
            <span v-if="horoscopeData.age">　虚岁{{ horoscopeData.age.nominalAge }}</span>
          </div>
          <div class="ci-sihua" v-if="horoscopeData">
            <div v-if="horoscopeData.decadal?.mutagen?.length" class="ci-small">
              限四化：<span v-for="(s,i) in horoscopeData.decadal.mutagen" :key="'d'+i"
                :style="{ color: MUTAGEN_COLORS[MUTAGEN_LABELS[i]] }">{{ s }}{{ MUTAGEN_LABELS[i] }} </span>
            </div>
            <div v-if="horoscopeData.yearly?.mutagen?.length" class="ci-small">
              年四化：<span v-for="(s,i) in horoscopeData.yearly.mutagen" :key="'y'+i"
                :style="{ color: MUTAGEN_COLORS[MUTAGEN_LABELS[i]] }">{{ s }}{{ MUTAGEN_LABELS[i] }} </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Horoscope Bottom Panel -->
      <div class="h-panel">
        <!-- 大限 -->
        <div class="h-row">
          <div class="h-label">大限</div>
          <div class="h-scroll" ref="decadalScrollRef">
            <div v-for="d in decadalList" :key="d.palaceIdx"
              class="h-item" :class="{ active: selDecadal?.palaceIdx === d.palaceIdx }"
              @click="selectDecadal(d)">
              <div>{{ d.range[0] }}~{{ d.range[1] }}</div>
              <div class="h-sub">{{ d.stem }}{{ d.branch }}限</div>
            </div>
          </div>
          <div class="h-arrow" @click="scrollRight(decadalScrollRef)">▷</div>
        </div>
        <!-- 流年 -->
        <div class="h-row">
          <div class="h-label">流年</div>
          <div class="h-scroll" ref="yearScrollRef">
            <div v-for="y in yearList" :key="y.year"
              class="h-item" :class="{ active: selYear === y.year }"
              @click="selectYear(y)">
              <div>{{ y.year }}年</div>
              <div class="h-sub">{{ y.sb }}{{ y.age }}岁</div>
            </div>
          </div>
          <div class="h-arrow" @click="scrollRight(yearScrollRef)">▷</div>
        </div>
        <!-- 流月 -->
        <div class="h-row">
          <div class="h-label">流月</div>
          <div class="h-scroll">
            <div v-for="(m, i) in MONTH_NAMES" :key="i"
              class="h-item" :class="{ active: selMonth === i + 1 }"
              @click="selectMonth(i + 1)">{{ m }}</div>
          </div>
        </div>
        <!-- 流日 -->
        <div class="h-row">
          <div class="h-label">流日</div>
          <div class="h-scroll">
            <div v-for="(d, i) in DAY_NAMES" :key="i"
              class="h-item" :class="{ active: selDay === i + 1 }"
              @click="selectDay(i + 1)">{{ d }}</div>
          </div>
        </div>
        <!-- 流时 -->
        <div class="h-row">
          <div class="h-label">流时</div>
          <div class="h-scroll">
            <div v-for="(h, i) in HOUR_NAMES" :key="i"
              class="h-item" :class="{ active: selHour === i }"
              @click="selectHour(i)">{{ h }}</div>
          </div>
        </div>
      </div>
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
.form-compact { display: flex; align-items: center; gap: 0.4em; padding: 0.4em; background: #fffcf5; border: 1px solid #d4c5a9; border-radius: 6px; margin-bottom: 0.5em; flex-wrap: wrap; }
.form-input-sm { font-family: inherit; font-size: 0.85em; padding: 0.3em; border: 1px solid #d4c5a9; border-radius: 4px; background: #faf6ef; color: #3c2415; }
.radio-sm { font-size: 0.85em; color: #3c2415; }
.btn-sm { background: #8b2500; color: #fff; border: none; padding: 0.3em 1em; border-radius: 10px; font-family: inherit; cursor: pointer; font-size: 0.85em; }

/* === Chart Grid === */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, auto);
  border: 2px solid #8b2500;
  background: #faf6ef;
}

/* === Palace Cell === */
.palace-cell {
  border: 1px solid #d4c5a9;
  padding: 3px;
  min-height: 100px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  position: relative;
  transition: background 0.15s;
}
.palace-cell:hover { background: rgba(184, 134, 11, 0.06); }
.palace-cell.is-selected { outline: 2px solid #009900; outline-offset: -2px; background: rgba(0, 153, 0, 0.05); z-index: 1; }
.palace-cell.is-sanfang { outline: 2px dashed #b8860b; outline-offset: -2px; background: rgba(184, 134, 11, 0.05); }

/* === Stars === */
.star-row { display: flex; flex-wrap: wrap; gap: 2px; }
.major-row { margin-bottom: 2px; }
.star-col { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.15; margin-right: 1px; }
.sname { white-space: nowrap; }
.major-name { font-weight: bold; color: #3c2415; font-size: 13px; }
.minor-name { color: #555; font-size: 11px; }
.sbright { font-size: 10px; }
.b-good { color: #b8860b; }
.b-mid { color: #aaa; }
.b-bad { color: #c41e3a; }
.smut { font-size: 10px; font-weight: bold; }
.sadj { color: #888; font-size: 10px; margin-right: 2px; }

/* === Flying 四化 === */
.flying-labels { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px; }
.fly-tag { font-size: 10px; font-weight: bold; padding: 0 2px; border-radius: 2px; white-space: nowrap; }
.fly-self { border: 1px solid; background: rgba(255,255,255,0.7); }

/* === Flow Stars === */
.flow-stars { display: flex; flex-wrap: wrap; gap: 1px; margin-top: 1px; }
.flow-star { font-size: 10px; white-space: nowrap; }
.scope-decadal { color: #0066cc; }
.scope-yearly { color: #cc6600; }

/* === Horoscope Flying & Labels === */
.h-flying { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 1px; }
.h-fly-tag { font-size: 10px; font-weight: bold; }
.h-palace-labels { display: flex; gap: 3px; margin-top: 1px; }
.h-plabel { font-size: 10px; color: #0066cc; font-weight: bold; }

/* === Derived Name === */
.derived-label { font-size: 10px; color: #cc6600; font-weight: bold; margin-top: 1px; }

/* === Palace Bottom === */
.palace-bottom { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 2px; border-top: 1px dotted #e0d5c0; }
.pb-left { display: flex; flex-direction: column; gap: 1px; }
.cs12 { color: #888; font-size: 10px; }
.decadal-range { color: #c41e3a; font-weight: bold; font-size: 11px; }
.pb-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
.p-name { color: #8b2500; font-weight: bold; font-size: 12px; }
.body-tag { background: #c41e3a; color: #fff; font-size: 9px; padding: 0 2px; border-radius: 2px; display: inline-block; }
.p-branch { color: #b8860b; font-size: 11px; font-weight: bold; }

/* === Center Info === */
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
.ci-sihua { margin-top: 2px; }

/* === Horoscope Bottom Panel === */
.h-panel {
  border: 2px solid #8b2500;
  margin-top: 4px;
  margin-bottom: 1em;
  background: #fffcf5;
  border-radius: 0;
  overflow: hidden;
}
.h-row { display: flex; border-bottom: 1px solid #d4c5a9; }
.h-row:last-child { border-bottom: none; }
.h-label {
  min-width: 3.2em;
  padding: 4px;
  background: #f5f0e8;
  color: #8b2500;
  font-weight: bold;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid #d4c5a9;
  flex-shrink: 0;
}
.h-scroll {
  display: flex;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: thin;
}
.h-scroll::-webkit-scrollbar { height: 4px; }
.h-scroll::-webkit-scrollbar-thumb { background: #d4c5a9; border-radius: 2px; }
.h-item {
  padding: 3px 6px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 11px;
  color: #3c2415;
  border-right: 1px solid #eee;
  text-align: center;
  flex-shrink: 0;
  min-width: 3.5em;
}
.h-item:hover { background: rgba(184, 134, 11, 0.1); }
.h-item.active { background: #3366cc; color: #fff; }
.h-sub { font-size: 10px; color: inherit; }
.h-arrow {
  padding: 0 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #8b2500;
  border-left: 1px solid #d4c5a9;
  flex-shrink: 0;
  font-size: 14px;
}
.h-arrow:hover { background: rgba(184, 134, 11, 0.1); }
</style>
