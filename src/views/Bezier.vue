<script setup>
import { ref, onMounted, watch } from 'vue';
import { BezierCurve } from '../tools/bezier.js'
import { ElNotification } from 'element-plus'
import {i18n} from '../locale/i18n.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const algorithm = ref('formula')
const iters = ref(2)
const tstep = ref(0.1)
const animInfo = ref('')
const animDesc = ref('')

let bezier = null
let points = []

new URLSearchParams(location.search).forEach((value, key) => {
  if (key === 'algorithm') {
    algorithm.value = value
  } else if (key === 'tstep') {
    tstep.value = parseFloat(value)
  } else if (key === 'iters') {
    iters.value = parseInt(value)
  } else if (key === 'points') {
    points = BezierCurve.load(value)
  }
})

onMounted(() => {
  bezier = new BezierCurve('#canvas',
    {
      algorithm, iters, tstep
    },
    (title, desc) => {
      animInfo.value = title
      animDesc.value = desc
    },
    points)
})

watch([algorithm, iters, tstep], () => {
  bezier.redraw()
})

const animate = () => {
  bezier.redraw(true)
}
const share = () => {
  const points = bezier.save()
  const url = `${window.location.origin}/bezier?algorithm=${algorithm.value}&tstep=${tstep.value}&iters=${iters.value}&points=${points}`
  navigator.clipboard.writeText(url)

  ElNotification({
    title: i18n.global.t('bezier.shareTitle'),
    message: i18n.global.t('bezier.shareDesc'),
  })
}

const goBack = ()=>{
  router.push('/')
}
</script>

<template>
  <el-container style="height:100%;">
    <el-header>
      <el-page-header @back="goBack" style="padding-top: 10px;">
        <template #content>
          <span class="text-large font-600 mr-3"> {{$t('bezier.title')}} </span>
        </template>
      </el-page-header>
    </el-header>
    <el-container style="height:calc(100% - 40px)">
      <el-aside width="240px">
        <el-form label-position="left" label-width="auto">
          <el-form-item :label='$t("bezier.algorithm")'>
            <el-select v-model="algorithm" style="width:150px">
              <el-option :label='$t("bezier.byFormula")' value='formula' />
              <el-option :label='$t("bezier.byDeC")' value='DeC' />
            </el-select>
          </el-form-item>

          <el-form-item v-if="algorithm == 'formula'" :label='$t("bezier.tStep")'>
            <el-input-number v-model="tstep" :min="0.01" :max="0.5" :step="0.01" :precision="2" />
          </el-form-item>
          <el-form-item v-else :label='$t("bezier.iterNum")'>
            <el-input-number v-model="iters" :min="1" :max="10" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="animate">{{$t("bezier.playAnim")}}</el-button>
            <el-button @click="share">{{ $t("bezier.share") }}</el-button>
          </el-form-item>
        </el-form>
        <p class="usage">
          <el-text>
            <strong>{{ $t('bezier.usage') }}</strong>{{ $t('bezier.usageDetail') }}
          </el-text>
        </p>
      </el-aside>
      <el-main>
        <el-alert v-if='animInfo !== ""' class='animateinfo' :title="animInfo" :description="animDesc" type="success"
          :closable="false" />
        <svg id='canvas' xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet">
        </svg>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

svg {
  width: 100%;
  height: 100%;
  filter: invert(1)
}

aside, header {
  background-color: #1D1E1F
}

.usage,
.el-form {
  padding: 0 15px;
}

.usage {
  margin-top: 60px;
}

.el-main {
  overflow: hidden;
  padding: 0;
}

.animateinfo {
  opacity: 0.8;
  position: absolute;
  width: 300px;
}
</style>