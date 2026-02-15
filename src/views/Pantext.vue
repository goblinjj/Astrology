<script setup>
import { ref, defineProps } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import formatStar from '@/data/formatStar'
const props = defineProps(['gong'])

const gong = props.gong
const store = useLocalStorage(gong, []);

const formatText = (text) => {
    return text.replace(/\/(.*?)\//g, (m, p1) => {
        return '<span style="color: #c41e3a;">'+p1+'</span>'
    })
}

const shengxiao = [
    ['子鼠', '深藏不露，内敛，机灵，观察力强，低调，暗地发力'],
    ['丑牛', '扭矩，有原则性，做事有规矩，刚毅，细致，吹毛求疵'],
    ['寅虎', '有精神，不知疲倦，活泼，擅长带动气氛，社牛，不害羞'],
    ['卯兔', '学历能力强，有计划性，聪明，擅长折腾，计划失误，会留后路'],
    ['辰龙', '不耐现状，积极突破，爱往外跑（跨省、国），冒险，好动'],
    ['巳蛇', '谨慎多思，靠技术为生，有专长（技艺高超）'],
    ['午马', '急躁，领导特征，女生性格强势，重视名声，易受人关注景仰，野'],
    ['未羊', '比较宅，保守，运势较平稳，神经质，多思，敏感，需长时间接触才了解本质'],
    ['申猴', '喜伸张正义，不盲从，容易成为愤青，人际关系弱，不受控，激进'],
    ['酉鸡', '擅长唤醒世人，说教，易成为师表，话多，聒噪，小时候叛逆'],
    ['戌狗', '擅长照顾人，负责任（合作伙伴，伴侣合适），忠心'],
    ['亥猪', '童心未泯，浪漫，单纯，重视感情，爱享受'],
];

const starText = (star) => {
    for (let k in formatStar) {
        for (let v of formatStar[k]) {
            if (v.title == star)
                return {text: formatText(v[gong]), star: v}
        }
    }
    for (let v of shengxiao) {
        if (v[0] == star)
            return {text: formatText(v[1]), star: {}}
    }
}
</script>

<template>
    <div>
        <div v-for="star in store" style="margin-bottom: 0.5em;">
            <span style="font-size: large; color: #8b2500;" :title="starText(star).star.all">{{ star }} : </span><span v-html="starText(star).text"></span>
        </div>
    </div>
</template>

<style scoped>
</style>
