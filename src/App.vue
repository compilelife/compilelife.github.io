<script setup>
import { RouterView } from 'vue-router'
import { i18n } from './locale/i18n';
import { computed, watchEffect } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const locale = computed(()=>{
   if (i18n.global.locale === 'zh') {
      return zhCn
   } else {
      return en
   }
})
</script>

<template>
   <el-config-provider :locale="locale">
      <RouterView />
   </el-config-provider>
</template>

<style scoped>
</style>
