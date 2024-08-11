import { SVG } from "@svgdotjs/svg.js";
import '@svgdotjs/svg.draggable.js'
import {i18n} from '../locale/i18n.js'

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function clonePoints(arr) {
  const ret = []
  for (let i = 0; i < arr.length; i++) {
    ret.push(new Point(arr[i].x, arr[i].y))
  }
  return ret
}

//动画帧，即drawFn(param)
class AnimateFrame {
  constructor(drawFn, param) {
    this.drawFn = drawFn
    this.param = param
  }
  run() {
    return this.drawFn(this.param)
  }
}

//动画规划器，绘制时通过该类缓存每个步骤的动画帧，即每个分步应该如何绘制
//既可以通过play逐步绘制，也可以通过plainDraw直接画出最终一步（最终图形）
class Animator {
  constructor(setAnimInfo, g) {
    this.setAnimInfo = setAnimInfo
    this.g = g
    this.reset()
  }
  reset() {
    this.frames = []
    this.n = 0
  }
  seek(n) {
    this.n = n
    this.step()
  }
  step() {
    this.g.clear()
    const frame = this.frames[this.n]
    if (frame) {
      const desc = frame.run()
      this.setAnimInfo(i18n.global.t('bezier.animateInfoTitle', [this.n+1, this.frames.length]),  desc)
      this.n += 1
    }
  }
  addFrame(param, drawFn) {
    this.frames.push(new AnimateFrame(drawFn, param))
  }
  play() {
    this.seek(0)
    const iterval = 4000 / this.frames.length
    const timerId = setInterval(() => {
      if (this.n >= this.frames.length) {
        clearInterval(timerId)
        return
      }
      this.step()
    }, iterval)
  }
  plainDraw() {
    this.seek(this.frames.length - 1)
    this.setAnimInfo('', '')
  }
}

//计算n的阶乘
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

//计算组合
function Cni(n, i) {
  return factorial(n) / (factorial(i) * factorial(n - i));
}

//计算x的y次方，定义0的0次方是1
function pow(x, y) {
  if (x === 0 && y === 0) return 1
  return Math.pow(x, y)
}

export class BezierCurve {
  /**
   * @param {string} node svg selector
   * @param {*} param 曲线绘制参数
   * @param {*} setAnimInfo 通过这个函数显示一些绘制期间的信息
   * @param {*} points 初始化点位置
   */
  constructor(node, param={algorithm, iters, tstep}, setAnimInfo, points=[]) {
    this.svg = SVG(node)
    this.curveG = this.svg.group()

    this.anim = new Animator(setAnimInfo, this.curveG)
    this.points = [ ]
    if (points.length > 0) {
      for (const p of points) {
        this.addControlPoint(p[0], p[1])
      }
    } else {
      this.addControlPoint(100, 100)
      this.addControlPoint(250, 50)
      this.addControlPoint(400, 100)
    }
    

    this.param = param

    this.redraw()

    this.svg.on('dblclick', (e)=>{
      const p = this.svg.point(e.pageX, e.pageY)
      this.addControlPoint(p.x, p.y)
      this.redraw()
    })
  }

  /**
   * 
   * @param {string} value 解析URL里的字符串points参数
   * @returns [[x,y],...]
   */
  static load(value) {
    return JSON.parse(decodeURIComponent(value))
  }

  /**
   * 将点坐标保存为可放入URL的字符串
   * @returns [[x,y],...]的URL格式
   */
  save() {
    return encodeURIComponent(JSON.stringify(this.points.map(p=>[Math.floor(p.x), Math.floor(p.y)])))
  }

  /**
   * 在x,y位置添加控制点，并响应鼠标事件
   * @param {number} x 
   * @param {number} y 
   */
  addControlPoint(x, y) {
    const point = new Point(x, y)
    this.points.push(point)
    const circle = this.svg.circle(10).fill('#337ecc').center(point.x, point.y)
    circle
      .draggable()
      .on('dragmove', (e)=>{
        point.x = e.detail.box.cx
        point.y = e.detail.box.cy
        this.redraw()
        
      })
      .on('mouseenter', ()=>{
        circle.fill('#f89898')
        circle.coordText = this.curveG.text(`(${point.x.toFixed(0)}, ${point.y.toFixed(0)})`)
                                .move(point.x - 10, point.y + 20)
      })
      .on('mouseleave', ()=>{
        circle.fill('#337ecc')
        circle.coordText?.remove()
      })
  }

  /**
   * 直线连接采样点模拟曲线
   * @param {Point[]} controlPoints 控制点
   * @param {Point[]} curvePoints 曲线上的采样点
   */
  drawCurve(controlPoints, curvePoints) {
    for (let i = 0; i < controlPoints.length; i++) {
      const text = `P${i+1}`
      this.curveG.text(text).move(controlPoints[i].x-10, controlPoints[i].y-30)
    }

    this.drawLines(curvePoints, {color: 'black'})
  }

  drawLines(points, stroke) {
    for (let i = 1; i < points.length; i++) {
      let p0 = points[i-1]
      let p1 = points[i]
      this.curveG.line(p0.x, p0.y, p1.x, p1.y).stroke(stroke)
    }
  }

  /**
   * 按照公式从t=0每次步进step移动到t=1，计算过程中的各个采样点
   * @param {Point[]} points 控制点
   * @param {number} step 每次t步进多少
   */
  bezierByFormula(points, step) {
    this.anim.reset()

    const curvePoints = []
    const n = points.length - 1 //p0 p1 ... pn
    let t = 0
    function calculatePt(t) {//bezier公式
      let pt = new Point(0, 0)
      for (let i = 0; i <= n; i++) {
        const bi = Cni(n, i) * pow(t, i) * pow(1 - t, n - i)
        pt.x += points[i].x * bi
        pt.y += points[i].y * bi
      }
      return pt
    }
    while (t <= 1.0) {
      curvePoints.push(calculatePt(t))
      this.anim.addFrame({ t, curvePoints:clonePoints(curvePoints) }, param => {
        this.drawCurve(points, param.curvePoints)
        return `t = ${param.t.toFixed(2)}`
      })
      t += step
    }
    if (Math.abs(t - step - 1.0) > 0.001){//为避免最后连接不到端点，强制补齐一段
      t = 1.0
      curvePoints.push(calculatePt(t))
      this.anim.addFrame({ t, curvePoints:clonePoints(curvePoints) }, param => {
        this.drawCurve(points, param.curvePoints)
        return `t = ${param.t.toFixed(2)}`
      })
    }
    return curvePoints
  }

  /**
   * 按De Casteljau公式，对所给控制点表示的曲线，按t=0.5分割为两个部分；如原先控制点4个，则分成左4个控制点组成的曲线，和右4个控制点组成的曲线
   * @param  {Point[]} points 控制点表示的曲线
   * @return {Point[][]} 左右两段曲线
   */
  doBezierDivide(points) {
    const n = points.length - 1
    const left = []
    const right = []

    const lut = []
    for (let i = 0; i <= n; i++) {
        lut.push(new Array(n+1))
    }

    //参考：https://zh.wikipedia.org/wiki/%E5%BE%B7%E5%8D%A1%E6%96%AF%E7%89%B9%E9%87%8C%E5%A5%A5%E7%AE%97%E6%B3%95
    //链接中的j，即这里的r, b即p
    //P[i][0] = P[i]
    //P[i][r] = P[i][r-1]*(1-t) + P[i+1][r-1]*t
    //        = (P[i][r-1]+P[i+1][r-1])/2 当t=1/2
    function getPir(i, r) {
      let p = lut[i][r]//为方便理解将Pir缓存起来，用查表法实现
      if (p) {
          return p
      }
      p = new Point(0,0)
      if (r === 0) {
          p = points[i]
      } else {
          const p1 = getPir(i, r-1)
          const p2 = getPir(i+1, r-1)
          p.x = (p1.x+p2.x)/2
          p.y = (p1.y+p2.y)/2
      }
      lut[i][r] = p
      return p
    }
    
    //left: P[0][0], P[0][1]...P[0][n]
    for (let i = 0; i <= n; i++) {
        const r = i
        left.push(getPir(0,r))
    }
    //right：P[0][n], P[1][n-1]...P[n][0]
    for (let i = 0; i <= n; i++) {
        const r = n-i
        right.push(getPir(i,r))
    }
    return [left, right]
  }

  /**
   * @param points {Point[]}
   * @param dn {number} 执行几次分割
   */
  bezierByDivide(points, dn=1) {
    this.anim.reset()
    let segs = [points] //存放所有点组（控制点组）表示的曲线分段

    //从曲线分段取出所有的曲线样本点（即每次分割时t=1/2点）
    function extracCurvePoints() {
      const ret = [segs[0][0]]//先放入第一个分段的第一个点
      for (let i = 0; i < segs.length; i+=2) {//前一个分段的最后一个点与后一个分段的第一个点是重合的，且刚好是t=0.5,0.25,0.125...
        ret.push(segs[i+1][0])
      }
      ret.push(segs[segs.length-1][segs[segs.length-1].length - 1])//再放入最后一个分段的最后一个点
      return ret
    }

    //广度优先分割
    for (let i = 0; i < dn; i++) {
        let ret = []
        for (const seg of segs) {
            ret = ret.concat(this.doBezierDivide(seg))
        }
        segs = ret
        this.anim.addFrame({ i, curvePoints: extracCurvePoints(), controlPoints: segs.flat() }, param => {
          this.drawCurve(points, param.curvePoints)
          this.drawLines(param.controlPoints, {color: 'gray', dasharray: [3,3]})
          return i18n.global.t('bezier.curIters', [param.i+1])
        })
    }
    return extracCurvePoints()
  }

  redraw(anim=false) {
    if (this.param.algorithm.value === 'formula') {
      this.bezierByFormula(this.points, this.param.tstep.value)
    } else {
      this.bezierByDivide(this.points, this.param.iters.value)
    }

    if (anim) {
      this.anim.play()
    }else{
      this.anim.plainDraw()
    }
  }
}