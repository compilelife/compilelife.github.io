<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { BezierSurface, PointMatrix } from '../tools/bezierSurface.js'
import { ElNotification } from 'element-plus'
import {i18n} from '../locale/i18n.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const firstDivide = reactive({row:3, col:3})
const divide = reactive({row:3, col:3})
const showGrid = ref(true)
const animInfo = ref('')
const animDesc = ref('')
const count = ref(1)

let bezier = null
let points = null

new URLSearchParams(location.search).forEach((value, key) => {
  if (key === 'firstDivide') {
    const {row,col} = JSON.parse(value)
    firstDivide.row =row
    firstDivide.col =col
  } else if (key === 'divide') {
    const {row,col} = JSON.parse(value)
    divide.row =row
    divide.col =col
  } else if (key === 'showGrid') {
    showGrid.value = value=='true'
  } else if (key === 'points') {
    points = BezierSurface.load(value)
  } else if (key === 'count') {
    count.value = parseInt(value)
  }
})

onMounted(() => {
  bezier = new BezierSurface('#canvas',
    {
      firstDivide, divide, showGrid, count
    },
    (title, desc) => {
      animInfo.value = title
      animDesc.value = desc
    },
    points)
})

watch([firstDivide, divide, count, showGrid], () => {
  bezier.redraw()
})

const animate = () => {
  bezier.redraw(true)
}
const share = () => {
  const points = bezier.save()
  const url = `${window.location.origin}/beziersf?firstDivide=${JSON.stringify(firstDivide)}&divide=${JSON.stringify(divide)}&showGrid=${showGrid.value}&points=${points}&count=${count.value}`
  navigator.clipboard.writeText(url)

  ElNotification({
    title: i18n.global.t('bezier.shareTitle'),
    message: i18n.global.t('bezier.shareDesc'),
  })
}

const addRow = () => {
  bezier.addRow()
}
const addCol = () => {
  bezier.addCol()
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
          <span class="text-large font-600 mr-3"> {{$t('beziersf.title')}} </span>
        </template>
      </el-page-header>
    </el-header>
    <el-container style="height:calc(100% - 40px)">
      <el-aside width="320px">
        <el-form label-position="left" label-width="auto">
          <el-form-item :label='$t("beziersf.grid")'>
            <el-button @click="addRow">{{ $t('beziersf.addRow') }}</el-button>
            <el-button @click="addCol">{{ $t('beziersf.addCol') }}</el-button>
          </el-form-item>
          <el-form-item :label='$t("beziersf.tessellation")'>
            <el-input-number v-model="count" :min="1" :max="10" controls-position="right"/>
          </el-form-item>
          <el-form-item :label='$t("beziersf.firstDivide")'>
            <el-space>
                <el-input-number v-model="firstDivide.row" :min="2" :max="5" controls-position="right"/>
                <el-text>x</el-text>
                <el-input-number v-model="firstDivide.col" :min="2" :max="5" controls-position="right"/>
            </el-space>
          </el-form-item>
          <el-form-item :label='$t("beziersf.divide")'>
            <el-space>
                <el-input-number v-model="divide.row" :min="2" :max="5" controls-position="right"/>
                <el-text>x</el-text>
                <el-input-number v-model="divide.col" :min="2" :max="5" controls-position="right"/>
            </el-space>
          </el-form-item>
          <el-form-item :label='$t("beziersf.showGrid")'>
            <el-checkbox v-model="showGrid"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="animate">{{$t("bezier.playAnim")}}</el-button>
            <el-button @click="share">{{ $t("bezier.share") }}</el-button>
          </el-form-item>
        </el-form>
        <p class="usage">
          <el-text>
            <strong>{{ $t('bezier.usage') }}</strong>{{ $t('beziersf.usageDetail') }}
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

.el-input-number {
    width: 70px;
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