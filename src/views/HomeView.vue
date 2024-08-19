<script setup>
import {reactive, ref, watch, watchEffect} from 'vue'
import { Waterfall } from 'vue-waterfall-plugin-next'
import bezierImg from '@/assets/bezier.png';
import bezierSfImg from '@/assets/beziersf.png';
import latticeImg from '@/assets/lattice.png';
import { useRouter } from 'vue-router'
import {i18n} from '../locale/i18n.js'

const router = useRouter()

const list = reactive([
  {
    title: '',
    url: '/bezier',
    img: bezierImg,
  },
  {
    title: 'Bezier Surface',
    url: '/beziersf',
    img: bezierSfImg,
  },
  {
    title: 'Loginsight',
    url: 'https://www.loginsight.top/',
    img: 'https://s1.ax1x.com/2022/10/12/xU5DE9.png',
  },
  {
    title: '',
    url: '/lattice',
    img: latticeImg,
  }
])

watchEffect(()=>{
  for (let i = 0; i < list.length; i++) {
    list[i].desc = i18n.global.t(`desc.i${i}`)
  }
  list[0].title = i18n.global.t('bezier.title')
  list[1].title = i18n.global.t('beziersf.title')
  list[3].title = i18n.global.t('lattice.title')
})

const breakpoints =ref({
  1920: {
    rowPerView: 4,
  },
  1200: {
    // when wrapper width < 1200
    rowPerView: 3,
  },
  800: {
    // when wrapper width < 800
    rowPerView: 2,
  },
  500: {
    // when wrapper width < 500
    rowPerView: 1,
  },
})

const localeText = ref({
  'en': 'English',
  'zh': '中文'
})

const openUrl = (url)=>{
  if (url.startsWith('http')) {
    window.open(url, '_blank')
  } else {
    router.push(url)
  }
}

</script>

<template>
  <el-container style="height:100%;">
    <el-header>
      <div class="title">
        <h1>{{$t('title')}}</h1>
        <el-row>
          <el-col :span="18">
            <el-select
              v-model="$i18n.locale"
              style="width: 100px;margin-right: 15px;"
            >
              <el-option
                v-for="locale in $i18n.availableLocales"
                :key="`locale-${locale}`"
                :value="locale"
                :label="localeText[locale]"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <a href="http://github.com/compilelife" target="_blank">
              <svg height="32" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true">
                <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
              </svg>
            </a>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <Waterfall :list="list" :breakpoints="breakpoints" :gutter="30" backgroundColor="#141414">
        <template #item="{ item, url, index }">
          <el-card class='card' @click="openUrl(item.url)" body-style="padding: 10px">
            <template #header>{{item.title}}</template>
            <el-image class="card-img" loading="lazy" :src="item.img" fit="fill"/>
            <template #footer>{{ item.desc }}</template>
          </el-card>
        </template>
      </Waterfall>
    </el-main>
  </el-container>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
}
header {
  border-bottom: 1px solid var(--el-border-color);
}
svg {
  filter: invert(1)
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title h1 {
  font-size: 1.3rem;
}
.card-img {
  width: 100%;
  height: 200px;
}
.card {
  /* height: 350px; */
  max-width: 340px;
}
.card:hover {
  border-color: var(--el-color-primary);
  cursor: pointer;
}
</style>