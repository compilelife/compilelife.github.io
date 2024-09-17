import{B as R}from"./bezierSurface-CoAOaD6o.js";import{_ as W,u as X,l as G,r as g,a as Z,o as ee,w as le,b as n,c as y,d as S,e as t,f as e,g as $,t as _,h as v,m as oe,n as te,F as ae,j as ne,E as se,i as J,p as ie,k as re}from"./index-B7aZGolE.js";import"./svg.draggable-CvVuDuZ7.js";const ue=V=>(ie("data-v-3fa9b01d"),V=V(),re(),V),de={class:"text-large font-600 mr-3"},ce={class:"usage"},pe=ue(()=>$("svg",{id:"canvas",xmlns:"http://www.w3.org/2000/svg",version:"1.1",viewBox:"0 0 800 600",preserveAspectRatio:"xMidYMid meet"},null,-1)),me={__name:"BezierSurface",setup(V){const O=X(),d=G({row:3,col:3}),c=G({row:3,col:3}),w=g(!0),z=g(""),B=g(""),b=g(1);let p=null,D=null;const r=Z().query;class N{constructor(l,s,h){this.row=l,this.col=s,this.key=`${l}-${s}`,this.p=h}}const m=g(new N(0,0,{x:0,y:0})),U=g([]);if(r.firstDivide){const{row:o,col:l}=JSON.parse(r.firstDivide);d.row=o,d.col=l}if(r.divide){const{row:o,col:l}=JSON.parse(r.divide);c.row=o,c.col=l}r.showGrid&&(w.value=r.showGrid=="true"),r.points&&(D=R.load(r.points)),r.count&&(b.value=parseInt(r.count));const x=()=>{const o=p.ps.points,l=[];for(let s=0;s<o.length;s++){const h=o[s];for(let u=0;u<h.length;u++){const i=o[s][u];l.push(new N(s,u,i)),s==m.value.row&&u==m.value.col&&(m.value.p=i)}}U.value=l};ee(()=>{p=new R("#canvas",{firstDivide:d,divide:c,showGrid:w,count:b},(o,l)=>{z.value=o,B.value=l},D),x()}),le([d,c,b,w],()=>{p.redraw()});const E=()=>{p.redraw(!0)},M=()=>{const o=p.save(),l=`${window.location.origin}/#/beziersf?firstDivide=${JSON.stringify(d)}&divide=${JSON.stringify(c)}&showGrid=${w.value}&points=${o}&count=${b.value}`;navigator.clipboard.writeText(l),se({title:J.global.t("bezier.shareTitle"),message:J.global.t("bezier.shareDesc")})},I=()=>{p.recreateSvgControlPoints(),p.redraw()},T=()=>{p.addRow(),x()},j=()=>{p.addCol(),x()},q=()=>{O.push("/")};return(o,l)=>{const s=n("el-page-header"),h=n("el-header"),u=n("el-button"),i=n("el-form-item"),f=n("el-input-number"),k=n("el-text"),C=n("el-space"),A=n("el-checkbox"),F=n("el-option"),L=n("el-select"),Y=n("el-form"),H=n("el-aside"),K=n("el-alert"),Q=n("el-main"),P=n("el-container");return y(),S(P,{style:{height:"100%"}},{default:t(()=>[e(h,null,{default:t(()=>[e(s,{onBack:q,style:{"padding-top":"10px"}},{content:t(()=>[$("span",de,_(o.$t("beziersf.title")),1)]),_:1})]),_:1}),e(P,{style:{height:"calc(100% - 40px)"}},{default:t(()=>[e(H,{width:"320px"},{default:t(()=>[e(Y,{"label-position":"left","label-width":"auto"},{default:t(()=>[e(i,{label:o.$t("beziersf.grid")},{default:t(()=>[e(u,{onClick:T},{default:t(()=>[v(_(o.$t("beziersf.addRow")),1)]),_:1}),e(u,{onClick:j},{default:t(()=>[v(_(o.$t("beziersf.addCol")),1)]),_:1})]),_:1},8,["label"]),e(i,{label:o.$t("beziersf.tessellation")},{default:t(()=>[e(f,{modelValue:b.value,"onUpdate:modelValue":l[0]||(l[0]=a=>b.value=a),min:1,max:4,"controls-position":"right"},null,8,["modelValue"])]),_:1},8,["label"]),e(i,{label:o.$t("beziersf.firstDivide")},{default:t(()=>[e(C,null,{default:t(()=>[e(f,{modelValue:d.row,"onUpdate:modelValue":l[1]||(l[1]=a=>d.row=a),min:2,max:5,"controls-position":"right"},null,8,["modelValue"]),e(k,null,{default:t(()=>[v("x")]),_:1}),e(f,{modelValue:d.col,"onUpdate:modelValue":l[2]||(l[2]=a=>d.col=a),min:2,max:5,"controls-position":"right"},null,8,["modelValue"])]),_:1})]),_:1},8,["label"]),e(i,{label:o.$t("beziersf.divide")},{default:t(()=>[e(C,null,{default:t(()=>[e(f,{modelValue:c.row,"onUpdate:modelValue":l[3]||(l[3]=a=>c.row=a),min:2,max:5,"controls-position":"right"},null,8,["modelValue"]),e(k,null,{default:t(()=>[v("x")]),_:1}),e(f,{modelValue:c.col,"onUpdate:modelValue":l[4]||(l[4]=a=>c.col=a),min:2,max:5,"controls-position":"right"},null,8,["modelValue"])]),_:1})]),_:1},8,["label"]),e(i,{label:o.$t("beziersf.showGrid")},{default:t(()=>[e(A,{modelValue:w.value,"onUpdate:modelValue":l[5]||(l[5]=a=>w.value=a)},null,8,["modelValue"])]),_:1},8,["label"]),e(i,null,{default:t(()=>[e(u,{type:"primary",onClick:E},{default:t(()=>[v(_(o.$t("bezier.playAnim")),1)]),_:1}),e(u,{onClick:M},{default:t(()=>[v(_(o.$t("bezier.share")),1)]),_:1})]),_:1}),e(i,{label:o.$t("beziersf.pointCoord")},{default:t(()=>[e(L,{modelValue:m.value,"onUpdate:modelValue":l[6]||(l[6]=a=>m.value=a),"value-key":"key",style:{width:"165px"}},{default:t(()=>[(y(!0),oe(ae,null,te(U.value,a=>(y(),S(F,{key:a.key,label:`P[${a.row}, ${a.col}]`,value:a},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1},8,["label"]),e(i,null,{default:t(()=>[e(C,null,{default:t(()=>[e(f,{modelValue:m.value.p.x,"onUpdate:modelValue":l[7]||(l[7]=a=>m.value.p.x=a),min:0,max:800,"controls-position":"right",onChange:I,style:{width:"120px"}},null,8,["modelValue"]),e(f,{modelValue:m.value.p.y,"onUpdate:modelValue":l[8]||(l[8]=a=>m.value.p.y=a),min:0,max:600,"controls-position":"right",onChange:I,style:{width:"120px"}},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),$("p",ce,[e(k,null,{default:t(()=>[$("strong",null,_(o.$t("bezier.usage")),1),v(_(o.$t("beziersf.usageDetail")),1)]),_:1})])]),_:1}),e(Q,null,{default:t(()=>[z.value!==""?(y(),S(K,{key:0,class:"animateinfo",title:z.value,description:B.value,type:"success",closable:!1},null,8,["title","description"])):ne("",!0),pe]),_:1})]),_:1})]),_:1})}}},we=W(me,[["__scopeId","data-v-3fa9b01d"]]);export{we as default};