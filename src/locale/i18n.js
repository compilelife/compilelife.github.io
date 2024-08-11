import { createI18n } from 'vue-i18n'
export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'zh',
  messages: {
    en: {
      desc: {
        i0: 'Learn how to draw Bézier curves through animations.',
        i1: 'Quickly analyze large log files',
      },
      title: "Compilelife's Toolbox",
      bezier: {
        title: 'Bézier Curve',
        algorithm: 'Algorithm',
        byFormula: 'Formula',
        byDeC: 'De Casteljau',
        tStep: 'T Step',
        iterNum: 'Iterations',
        playAnim: 'Play Animation',
        share: 'Share',
        usage: 'Usage: ',
        usageDetail: 'Double-click to add control points. Drag control points to change the curve shape.',
        shareTitle: 'Share Bézier Curve',
        shareDesc: 'The link has been copied. You can paste it in the browser to access it.',
        animateInfoTitle: 'Animation Step: {0} / {1}',
        curIters: 'Currrent iteration: {0}'
      },
    },
    zh: {
      desc: {
        i0: '通过动画理解贝塞尔曲线如何绘制',
        i1: '快速分析大文件日志'
      },
      title: '瞎猫的工具箱',
      bezier: {
        title: '贝塞尔曲线',
        algorithm: '绘制算法',
        byFormula: '按公式',
        byDeC: 'De Casteljau',
        tStep: 't步进',
        iterNum: '迭代次数',
        playAnim: '播放动画',
        share: '分享曲线',
        usage: '用法：',
        usageDetail: '双击添加控制点；拖动控制点改变曲线形状',
        shareTitle: '分享贝塞尔曲线',
        shareDesc: '链接已复制，在浏览器里粘贴链接即可访问',
        animateInfoTitle: '动画步数: {0} / {1}',
        curIters: '迭代次数：{0}'
      },
    }
  }
})