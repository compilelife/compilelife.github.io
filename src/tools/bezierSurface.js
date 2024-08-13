import { SVG } from "@svgdotjs/svg.js";
import '@svgdotjs/svg.draggable.js'
import { i18n } from '../locale/i18n.js'

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

class Mesh {
  constructor(uvPoints) {
    /**
     * @type {Point[]}
     */
    this.uvPoints = uvPoints//左上、右上、右下、左下
    /**
     * @type {Point[]}
     */
    this.screenPoints = new Array(4)
  }
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
      this.setAnimInfo(i18n.global.t('bezier.animateInfoTitle', [this.n + 1, this.frames.length]), desc)
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

export class PointMatrix {
  /**
   * @param {[][][]} points 
   */
  constructor(points) {
    if (points) {
      this.points = points.map(row=>row.map(xy=>new Point(xy[0],xy[1])))
    } else {
      this.points = Array(3).fill().map(()=>Array(3).fill().map(()=>new Point(0,0)))
    }
  }

  addRow() {
    const row = this.points[this.points.length - 1].map(p=>new Point(p.x, p.y+20))
    this.points.push(row)
  }

  addCol() {
    for (let i = 0; i < this.points.length; i++) {
      const row = this.points[i]
      const p = row[row.length - 1]
      row.push(new Point(p.x+20, p.y))
    }
  }

  at(i,j) {
    return this.points[i][j]
  }
}

/**
  * @param points {Point[]}
  * @param uv {UVPoint}
  * @returns [Point]
*/
function bezierSurfacePoint(points, uv) {
  const ni = points.length - 1
  const nj = points[0].length - 1
  const u = uv.u
  const v = uv.v
  let ret = new Point(0, 0)
  for (let i = 0; i <= ni; i++) {
    const bi = Cni(ni, i) * pow(v, i) * pow(1 - v, ni - i)
    for (let j = 0; j <= nj; j++) {
      const bj = Cni(nj, j) * pow(u, j) * pow(1 - u, nj - j)
      ret.x += points[i][j].x * bi * bj
      ret.y += points[i][j].y * bi * bj
    }
  }
  return ret
}


export class BezierSurface {
  /**
   * @param {string} node svg selector
   * @param {*} param 曲线绘制参数
   * @param {*} setAnimInfo 通过这个函数显示一些绘制期间的信息
   * @param {*} points 初始化点位置
   */
  constructor(node, param = { firstDivide, divide, showGrid, count }, setAnimInfo, points = null) {
    this.svg = SVG(node)
    this.curveG = this.svg.group()
    this.controlG = this.svg.group()

    this.anim = new Animator(setAnimInfo, this.curveG)
    this.ps = new PointMatrix(points)
    if (!points) {
      for (let i = 0; i < this.ps.points.length; i++) {
        const r = this.ps.points[i]
        for (let j = 0; j < r.length; j++) {
          r[j].x = j * 150
          r[j].y = i * 150
        }
      }
    }
    this.recreateSvgControlPoints()

    this.param = param

    this.redraw()
  }

  addRow() {
    this.ps.addRow()
    this.recreateSvgControlPoints()
    this.redraw()
  }

  addCol() {
    this.ps.addCol()
    this.recreateSvgControlPoints()
    this.redraw()
  }

  /**
   * 
   * @param {string} value 解析URL里的字符串points参数
   * @returns [][][]
   */
  static load(value) {
    return JSON.parse(value)
  }

  /**
   * 将点坐标保存为可放入URL的字符串
   * @returns [[x,y],...]的URL格式
   */
  save() {
    const value = JSON.stringify(
      this.ps.points.map(r=>
        r.map(p=>[Math.floor(p.x), Math.floor(p.y)])
      )
    )
    return value
  }

  recreateSvgControlPoints() {
    this.controlG.clear()

    for (let i = 0; i < this.ps.points.length; i++) {
      const r = this.ps.points[i]
      for (let j = 0; j < r.length; j++) {
        const point = r[j]
        point.i = i
        point.j = j
        const circle = this.controlG.circle(10).fill('#337ecc').center(point.x, point.y)
        circle
          .draggable()
          .on('dragmove', (e) => {
            point.x = e.detail.box.cx
            point.y = e.detail.box.cy
            this.redraw()

          })
          .on('mouseenter', () => {
            circle.fill('#f89898')
            circle.coordText = this.curveG.text(`[${point.i}, ${point.j}](${point.x.toFixed(0)}, ${point.y.toFixed(0)})`)
              .move(point.x - 10, point.y + 20)
          })
          .on('mouseleave', () => {
            circle.fill('#337ecc')
            circle.coordText?.remove()
          })
      }
    }
  }

  /**
  * @param meshes {Mesh[]}
  * @param divide {number} 每次分割成dividexdivide
  */
  meshDivide(meshes, nu = 2, nv = nu) {
    let ret = []
    for (const mesh of meshes) {
      const lu = mesh.uvPoints[0].u
      const ru = mesh.uvPoints[1].u
      const tv = mesh.uvPoints[0].v
      const bv = mesh.uvPoints[3].v
      const du = (ru - lu) / nu
      const dv = (bv - tv) / nv
      for (let m = 0; m < nv; m++) {
        for (let n = 0; n < nu; n++) {
          ret.push(new Mesh([
            new UVPoint(lu + du * n, tv + dv * m),
            new UVPoint(lu + du * n + du, tv + dv * m),
            new UVPoint(lu + du * n + du, tv + dv * m + dv),
            new UVPoint(lu + du * n, tv + dv * m + dv),
          ]))
        }
      }
    }
    return ret
  }

  bezierSurface(points) {
    const {firstDivide, divide, showGrid, count} = this.param
    let firstu = new Set([0,1])
    let firstv = new Set([0,1])

    const roundFloat = (f)=>Math.round(f*1000)//保留3位小数

    const calMeshPoints = (meshes)=>{
      for (const mesh of meshes) {
          for (let i = 0; i < 4; i++) {
              mesh.screenPoints[i] = bezierSurfacePoint(points, mesh.uvPoints[i])
          }
      }
      return meshes
    }
    const colllectFirstUV = (meshes)=>{
      meshes.forEach(mesh=>{
        mesh.uvPoints.forEach(uv=>{
          firstu.add(roundFloat(uv.u))
          firstv.add(roundFloat(uv.v))
        })
      })
    }
    const drawFrame = ({meshes})=>{
      //画出每个mesh的四条边
      for (const mesh of meshes) {
        if (showGrid.value || firstv.has(roundFloat(mesh.uvPoints[0].v))) {
          this.curveG.line(mesh.screenPoints[0].x, mesh.screenPoints[0].y,
             mesh.screenPoints[1].x, mesh.screenPoints[1].y).stroke({color: 'black'})
        }
        if (showGrid.value || firstu.has(roundFloat(mesh.uvPoints[1].u))) {
          this.curveG.line(mesh.screenPoints[1].x, mesh.screenPoints[1].y, 
            mesh.screenPoints[2].x, mesh.screenPoints[2].y).stroke({color: 'black'})
        }
        if (showGrid.value || firstv.has(roundFloat(mesh.uvPoints[2].v))) {
          this.curveG.line(mesh.screenPoints[2].x, mesh.screenPoints[2].y, 
            mesh.screenPoints[3].x, mesh.screenPoints[3].y).stroke({color: 'black'})
        }
        if (showGrid.value || firstu.has(roundFloat(mesh.uvPoints[3].u))) {
          this.curveG.line(mesh.screenPoints[3].x, mesh.screenPoints[3].y, 
            mesh.screenPoints[0].x, mesh.screenPoints[0].y).stroke({color: 'black'})
        }
      }
    }

    this.anim.reset()

    let meshes = [new Mesh([new UVPoint(0,0),new UVPoint(1,0),new UVPoint(1,1),new UVPoint(0,1)])]
    this.anim.addFrame({meshes: calMeshPoints(meshes)}, drawFrame)
    
    meshes = this.meshDivide(meshes,firstDivide.row, firstDivide.col)
    colllectFirstUV(meshes)
    this.anim.addFrame({meshes: calMeshPoints(meshes)}, drawFrame)

    for (let i = 1; i < count.value; i++) {
      meshes = this.meshDivide(meshes, divide.row, divide.col)
      this.anim.addFrame({meshes: calMeshPoints(meshes)}, drawFrame)
    }
  }

  redraw(anim = false) {
    this.bezierSurface(this.ps.points)

    if (anim) {
      this.anim.play()
    } else {
      this.anim.plainDraw()
    }
  }
}