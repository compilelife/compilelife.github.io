<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { BezierSurface, BezierSurfaceWithUV } from '../tools/bezierSurface.js'
import { ElNotification } from 'element-plus'
import {i18n} from '../locale/i18n.js'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class UVPoint {
  constructor(u, v) {
    this.u = u
    this.v = v
  }
}

onMounted(() => {
    let points = [
        [[348,101],[741,75],[1140,158],[1528,25],[1918,0]],
        [[279,296],[689,274],[1106,342],[1510,235],[1918,215]],
        [[277,516],[709,420],[1104,532],[1511,447],[1918,431]],
        [[542,831],[894,759],[1222,748],[1584,665],[1918,648]],
        [[70,885],[531,879],[997,893],[1458,868],[1918,864]],
        [[1,1076],[481,1076],[961,1076],[1442,1076],[1918,1076]],
    ]

    const createControlPoints = (r1,r2,c1,c2,)=>{
        const ret = []
        for (let r = r1; r <= r2; r++) {
            const row = []
            for (let c = c1; c <= c2; c++) {
                row.push(points[r][c])
            }
            ret.push(row)
        }
        return ret
    }

    //画出底下的贝塞尔曲面分片
    const s1 = new BezierSurface('#canvas',{
      firstDivide: {row:2,col:2},
      divide: {row:2, col:2},
      showGrid: ref(false),
      count: ref(3)
    },()=>{}, createControlPoints(0,2,0,2))
    const s2 = new BezierSurface('#canvas',{
      firstDivide: {row:2,col:2},
      divide: {row:2, col:2},
      showGrid: ref(false),
      count: ref(3)
    },()=>{}, createControlPoints(0,2,2,4))
    const s3 = new BezierSurface('#canvas',{
      firstDivide: {row:3,col:2},
      divide: {row:2, col:2},
      showGrid: ref(false),
      count: ref(3)
    },()=>{}, createControlPoints(2,5,0,2))
    const s4 = new BezierSurface('#canvas',{
      firstDivide: {row:3,col:2},
      divide: {row:2, col:2},
      showGrid: ref(false),
      count: ref(3)
    },()=>{}, createControlPoints(2,5,2,4))

    //从分片绘制结果提取uv point
    const meshes = [s1, s2, s3, s4]
      .map(s=>s.anim.frames[s.anim.frames.length-1].param.meshes)
      .flat()
    const screenPoints = meshes.map(m=>m.screenPoints).flat()
    const uvPoints = screenPoints.map(p=>new UVPoint(p.x/1920, p.y/1080))

    //晶格
    new BezierSurfaceWithUV('#canvas', uvPoints, [
      [[217,120],[916,250],[1610,0]],
      [[319,600],[929,539],[1537,486]],
      [[181,1078],[1038,827],[1897,972]]
    ])
})

const goBack = ()=>{
  router.push('/')
}
</script>

<template>
  <el-container style="height:100%;">
    <el-header>
      <el-page-header @back="goBack" style="padding-top: 10px;">
        <template #content>
          <span class="text-large font-600 mr-3"> {{$t('lattice.title')}} </span>
        </template>
      </el-page-header>
    </el-header>
    <el-container style="height:calc(100% - 40px)">
      <el-aside width="260px">
        <p class="usage">
          <el-text>
            <strong>{{ $t('bezier.usage') }}</strong>{{ $t('lattice.usageDetail') }}
          </el-text>
        </p>
      </el-aside>
      <el-main style="height:calc(100% - 40px)">
        <svg id='canvas' xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1920 1080"
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

.el-main {
  overflow: hidden;
  padding: 0;
}
</style>