import{S as se}from"./svg.draggable-CvVuDuZ7.js";import{i as M,_ as ne,u as le,l as J,r as C,a as ie,o as re,w as ae,b as _,c as F,d as j,e as u,f as n,g as B,t as S,h as z,m as ce,n as ue,F as de,j as he,E as me,p as pe,k as fe}from"./index-BSDqO66O.js";class D{constructor(e,t){this.x=e,this.y=t}}class ${constructor(e,t){this.u=e,this.v=t}}class O{constructor(e){this.uvPoints=e,this.screenPoints=new Array(4)}}class ve{constructor(e,t){this.drawFn=e,this.param=t}run(){return this.drawFn(this.param)}}class we{constructor(e,t){this.setAnimInfo=e,this.g=t,this.reset()}reset(){this.frames=[],this.n=0}seek(e){this.n=e,this.step()}step(){this.g.clear();const e=this.frames[this.n];if(e){const t=e.run();this.setAnimInfo(M.global.t("bezier.animateInfoTitle",[this.n+1,this.frames.length]),t),this.n+=1}}addFrame(e,t){this.frames.push(new ve(t,e))}play(){this.seek(0);const e=4e3/this.frames.length,t=setInterval(()=>{if(this.n>=this.frames.length){clearInterval(t);return}this.step()},e)}plainDraw(){this.seek(this.frames.length-1),this.setAnimInfo("","")}}function A(p){let e=1;for(let t=2;t<=p;t++)e*=t;return e}function E(p,e){return A(p)/(A(e)*A(p-e))}function I(p,e){return p===0&&e===0?1:Math.pow(p,e)}class ge{constructor(e){e?this.points=e.map(t=>t.map(s=>new D(s[0],s[1]))):this.points=Array(3).fill().map(()=>Array(3).fill().map(()=>new D(0,0)))}addRow(){const e=this.points[this.points.length-1].map(t=>new D(t.x,t.y+20));this.points.push(e)}addCol(){for(let e=0;e<this.points.length;e++){const t=this.points[e],s=t[t.length-1];t.push(new D(s.x+20,s.y))}}at(e,t){return this.points[e][t]}}function _e(p,e){const t=p.length-1,s=p[0].length-1,o=e.u,d=e.v;let r=new D(0,0);for(let a=0;a<=t;a++){const h=E(t,a)*I(d,a)*I(1-d,t-a);for(let g=0;g<=s;g++){const f=E(s,g)*I(o,g)*I(1-o,s-g);r.x+=p[a][g].x*h*f,r.y+=p[a][g].y*h*f}}return r}let q=class{constructor(e,t={firstDivide,divide,showGrid,count},s,o=null){if(this.svg=se(e),this.curveG=this.svg.group(),this.controlG=this.svg.group(),this.anim=new we(s,this.curveG),this.ps=new ge(o),!o)for(let d=0;d<this.ps.points.length;d++){const r=this.ps.points[d];for(let a=0;a<r.length;a++)r[a].x=a*150,r[a].y=d*150}this.recreateSvgControlPoints(),this.param=t,this.redraw()}addRow(){this.ps.addRow(),this.recreateSvgControlPoints(),this.redraw()}addCol(){this.ps.addCol(),this.recreateSvgControlPoints(),this.redraw()}static load(e){return JSON.parse(e)}save(){return JSON.stringify(this.ps.points.map(t=>t.map(s=>[Math.floor(s.x),Math.floor(s.y)])))}recreateSvgControlPoints(){this.controlG.clear();for(let e=0;e<this.ps.points.length;e++){const t=this.ps.points[e];for(let s=0;s<t.length;s++){const o=t[s];o.i=e,o.j=s;const d=this.controlG.circle(10).fill("#337ecc").center(o.x,o.y);d.draggable().on("dragmove",r=>{o.x=r.detail.box.cx,o.y=r.detail.box.cy,this.redraw(),d.coordText=this.curveG.text(`[${o.i}, ${o.j}](${o.x.toFixed(0)}, ${o.y.toFixed(0)})`).move(o.x-10,o.y+20)}).on("mouseenter",()=>{d.fill("#f89898"),d.coordText=this.curveG.text(`[${o.i}, ${o.j}](${o.x.toFixed(0)}, ${o.y.toFixed(0)})`).move(o.x-10,o.y+20)}).on("mouseleave",()=>{var r;d.fill("#337ecc"),(r=d.coordText)==null||r.remove()})}}}meshDivide(e,t=2,s=t){let o=[];for(const d of e){const r=d.uvPoints[0].u,a=d.uvPoints[1].u,h=d.uvPoints[0].v,g=d.uvPoints[3].v,f=(a-r)/s,b=(g-h)/t;for(let m=0;m<t;m++)for(let w=0;w<s;w++)o.push(new O([new $(r+f*w,h+b*m),new $(r+f*w+f,h+b*m),new $(r+f*w+f,h+b*m+b),new $(r+f*w,h+b*m+b)]))}return o}bezierSurface(e){const{firstDivide:t,divide:s,showGrid:o,count:d}=this.param;let r=new Set([0,1]),a=new Set([0,1]);const h=w=>Math.round(w*1e3),g=w=>{for(const i of w)for(let V=0;V<4;V++)i.screenPoints[V]=_e(e,i.uvPoints[V]);return w},f=w=>{w.forEach(i=>{i.uvPoints.forEach(V=>{r.add(h(V.u)),a.add(h(V.v))})})},b=({meshes:w})=>{for(const i of w)(o.value||a.has(h(i.uvPoints[0].v)))&&this.curveG.line(i.screenPoints[0].x,i.screenPoints[0].y,i.screenPoints[1].x,i.screenPoints[1].y).stroke({color:"black"}),(o.value||r.has(h(i.uvPoints[1].u)))&&this.curveG.line(i.screenPoints[1].x,i.screenPoints[1].y,i.screenPoints[2].x,i.screenPoints[2].y).stroke({color:"black"}),(o.value||a.has(h(i.uvPoints[2].v)))&&this.curveG.line(i.screenPoints[2].x,i.screenPoints[2].y,i.screenPoints[3].x,i.screenPoints[3].y).stroke({color:"black"}),(o.value||r.has(h(i.uvPoints[3].u)))&&this.curveG.line(i.screenPoints[3].x,i.screenPoints[3].y,i.screenPoints[0].x,i.screenPoints[0].y).stroke({color:"black"})};this.anim.reset();let m=[new O([new $(0,0),new $(1,0),new $(1,1),new $(0,1)])];this.anim.addFrame({meshes:g(m)},b),m=this.meshDivide(m,t.row,t.col),f(m),this.anim.addFrame({meshes:g(m)},b);for(let w=1;w<d.value;w++)m=this.meshDivide(m,s.row,s.col),this.anim.addFrame({meshes:g(m)},b)}redraw(e=!1){this.bezierSurface(this.ps.points),e?this.anim.play():this.anim.plainDraw()}};const be=p=>(pe("data-v-3fa9b01d"),p=p(),fe(),p),xe={class:"text-large font-600 mr-3"},ye={class:"usage"},Pe=be(()=>B("svg",{id:"canvas",xmlns:"http://www.w3.org/2000/svg",version:"1.1",viewBox:"0 0 800 600",preserveAspectRatio:"xMidYMid meet"},null,-1)),Ve={__name:"BezierSurface",setup(p){const e=le(),t=J({row:3,col:3}),s=J({row:3,col:3}),o=C(!0),d=C(""),r=C(""),a=C(1);let h=null,g=null;const f=ie().query;class b{constructor(l,x,G){this.row=l,this.col=x,this.key=`${l}-${x}`,this.p=G}}const m=C(new b(0,0,{x:0,y:0})),w=C([]);if(f.firstDivide){const{row:c,col:l}=JSON.parse(f.firstDivide);t.row=c,t.col=l}if(f.divide){const{row:c,col:l}=JSON.parse(f.divide);s.row=c,s.col=l}f.showGrid&&(o.value=f.showGrid=="true"),f.points&&(g=q.load(f.points)),f.count&&(a.value=parseInt(f.count));const i=()=>{const c=h.ps.points,l=[];for(let x=0;x<c.length;x++){const G=c[x];for(let P=0;P<G.length;P++){const y=c[x][P];l.push(new b(x,P,y)),x==m.value.row&&P==m.value.col&&(m.value.p=y)}}w.value=l};re(()=>{h=new q("#canvas",{firstDivide:t,divide:s,showGrid:o,count:a},(c,l)=>{d.value=c,r.value=l},g),i()}),ae([t,s,a,o],()=>{h.redraw()});const V=()=>{h.redraw(!0)},L=()=>{const c=h.save(),l=`${window.location.origin}/#/beziersf?firstDivide=${JSON.stringify(t)}&divide=${JSON.stringify(s)}&showGrid=${o.value}&points=${c}&count=${a.value}`;navigator.clipboard.writeText(l),me({title:M.global.t("bezier.shareTitle"),message:M.global.t("bezier.shareDesc")})},R=()=>{h.recreateSvgControlPoints(),h.redraw()},Y=()=>{h.addRow(),i()},H=()=>{h.addCol(),i()},K=()=>{e.push("/")};return(c,l)=>{const x=_("el-page-header"),G=_("el-header"),P=_("el-button"),y=_("el-form-item"),k=_("el-input-number"),N=_("el-text"),U=_("el-space"),Q=_("el-checkbox"),W=_("el-option"),X=_("el-select"),Z=_("el-form"),ee=_("el-aside"),te=_("el-alert"),oe=_("el-main"),T=_("el-container");return F(),j(T,{style:{height:"100%"}},{default:u(()=>[n(G,null,{default:u(()=>[n(x,{onBack:K,style:{"padding-top":"10px"}},{content:u(()=>[B("span",xe,S(c.$t("beziersf.title")),1)]),_:1})]),_:1}),n(T,{style:{height:"calc(100% - 40px)"}},{default:u(()=>[n(ee,{width:"320px"},{default:u(()=>[n(Z,{"label-position":"left","label-width":"auto"},{default:u(()=>[n(y,{label:c.$t("beziersf.grid")},{default:u(()=>[n(P,{onClick:Y},{default:u(()=>[z(S(c.$t("beziersf.addRow")),1)]),_:1}),n(P,{onClick:H},{default:u(()=>[z(S(c.$t("beziersf.addCol")),1)]),_:1})]),_:1},8,["label"]),n(y,{label:c.$t("beziersf.tessellation")},{default:u(()=>[n(k,{modelValue:a.value,"onUpdate:modelValue":l[0]||(l[0]=v=>a.value=v),min:1,max:4,"controls-position":"right"},null,8,["modelValue"])]),_:1},8,["label"]),n(y,{label:c.$t("beziersf.firstDivide")},{default:u(()=>[n(U,null,{default:u(()=>[n(k,{modelValue:t.row,"onUpdate:modelValue":l[1]||(l[1]=v=>t.row=v),min:2,max:5,"controls-position":"right"},null,8,["modelValue"]),n(N,null,{default:u(()=>[z("x")]),_:1}),n(k,{modelValue:t.col,"onUpdate:modelValue":l[2]||(l[2]=v=>t.col=v),min:2,max:5,"controls-position":"right"},null,8,["modelValue"])]),_:1})]),_:1},8,["label"]),n(y,{label:c.$t("beziersf.divide")},{default:u(()=>[n(U,null,{default:u(()=>[n(k,{modelValue:s.row,"onUpdate:modelValue":l[3]||(l[3]=v=>s.row=v),min:2,max:5,"controls-position":"right"},null,8,["modelValue"]),n(N,null,{default:u(()=>[z("x")]),_:1}),n(k,{modelValue:s.col,"onUpdate:modelValue":l[4]||(l[4]=v=>s.col=v),min:2,max:5,"controls-position":"right"},null,8,["modelValue"])]),_:1})]),_:1},8,["label"]),n(y,{label:c.$t("beziersf.showGrid")},{default:u(()=>[n(Q,{modelValue:o.value,"onUpdate:modelValue":l[5]||(l[5]=v=>o.value=v)},null,8,["modelValue"])]),_:1},8,["label"]),n(y,null,{default:u(()=>[n(P,{type:"primary",onClick:V},{default:u(()=>[z(S(c.$t("bezier.playAnim")),1)]),_:1}),n(P,{onClick:L},{default:u(()=>[z(S(c.$t("bezier.share")),1)]),_:1})]),_:1}),n(y,{label:c.$t("beziersf.pointCoord")},{default:u(()=>[n(X,{modelValue:m.value,"onUpdate:modelValue":l[6]||(l[6]=v=>m.value=v),"value-key":"key",style:{width:"165px"}},{default:u(()=>[(F(!0),ce(de,null,ue(w.value,v=>(F(),j(W,{key:v.key,label:`P[${v.row}, ${v.col}]`,value:v},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["label"]),n(y,null,{default:u(()=>[n(U,null,{default:u(()=>[n(k,{modelValue:m.value.p.x,"onUpdate:modelValue":l[7]||(l[7]=v=>m.value.p.x=v),min:0,max:800,"controls-position":"right",onChange:R,style:{width:"120px"}},null,8,["modelValue"]),n(k,{modelValue:m.value.p.y,"onUpdate:modelValue":l[8]||(l[8]=v=>m.value.p.y=v),min:0,max:600,"controls-position":"right",onChange:R,style:{width:"120px"}},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),B("p",ye,[n(N,null,{default:u(()=>[B("strong",null,S(c.$t("bezier.usage")),1),z(S(c.$t("beziersf.usageDetail")),1)]),_:1})])]),_:1}),n(oe,null,{default:u(()=>[d.value!==""?(F(),j(te,{key:0,class:"animateinfo",title:d.value,description:r.value,type:"success",closable:!1},null,8,["title","description"])):he("",!0),Pe]),_:1})]),_:1})]),_:1})}}},ze=ne(Ve,[["__scopeId","data-v-3fa9b01d"]]);export{ze as default};
