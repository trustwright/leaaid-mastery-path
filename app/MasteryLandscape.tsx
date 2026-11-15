'use client';
import {useEffect,useMemo,useRef} from 'react';

type LandscapeProps={
 completed:number;
 moduleId?:number;
 mastered?:number;
 total?:number;
 questionIndex?:number;
 answered?:boolean;
 correct?:boolean;
 compact?:boolean;
};

const STAGES=['FOUND','ARCH','ASSURE','STRATEGY','APPLY'];

export default function MasteryLandscape({completed,moduleId=Math.min(5,completed+1),mastered=0,total=10,questionIndex=1,answered=false,correct=false,compact=false}:LandscapeProps){
 const canvas=useRef<HTMLCanvasElement>(null);
 const resolved=Math.min(total,mastered);
 const gap=Math.max(0,total-resolved);
 const path=completed+Math.min(1,resolved/Math.max(1,total));
 const programPercent=Math.min(100,Math.round(path/5*100));
 const state=answered?(correct?'VERIFIED':'RETRY'):'DECIDE';
 const decision=Math.min(total,Math.max(1,questionIndex));
 const label=useMemo(()=>`${completed} of 5 modules complete. Module ${moduleId}: ${resolved} of ${total} decisions mastered, ${gap} remaining. Decision ${decision} of ${total}. ${state}.`,[completed,moduleId,resolved,total,gap,decision,state]);

 useEffect(()=>{
  const node=canvas.current;if(!node)return;
  const draw=()=>{
   const box=node.getBoundingClientRect();const dpr=Math.min(2,devicePixelRatio||1);const w=Math.max(300,box.width);const h=Math.max(compact?180:250,box.height);
   if(node.width!==Math.round(w*dpr)||node.height!==Math.round(h*dpr)){node.width=Math.round(w*dpr);node.height=Math.round(h*dpr)}
   const c=node.getContext('2d');if(!c)return;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
   const bg=c.createRadialGradient(w*.58,h*.5,10,w*.58,h*.5,w*.7);bg.addColorStop(0,'rgba(73,18,42,.72)');bg.addColorStop(.48,'rgba(20,13,29,.96)');bg.addColorStop(1,'rgba(5,7,12,1)');c.fillStyle=bg;c.fillRect(0,0,w,h);
   const terrain=(x:number,z:number)=>.42-.27*x+.055*Math.sin(x*12+z*4)+.04*Math.cos(z*13)-[.1,.3,.5,.7,.9].reduce((sum,m)=>sum+.075*Math.exp(-((x-m)**2+(z-.52)**2)/.006),0);
   const project=(x:number,z:number)=>{const y=terrain(x,z);return{x:w*(.07+x*.78+(z-.5)*.19),y:h*(.23+z*.59-y*.31)}};
   for(let zi=0;zi<27;zi++){const z=zi/26;c.beginPath();for(let xi=0;xi<=70;xi++){const p=project(xi/70,z);if(xi)c.lineTo(p.x,p.y);else c.moveTo(p.x,p.y)}const hue=198+zi*2.4;c.strokeStyle=`hsla(${hue},88%,${56+zi*.45}%,${.14+zi*.012})`;c.lineWidth=zi%4===0?1.15:.65;c.stroke()}
   for(let xi=0;xi<22;xi++){const x=xi/21;c.beginPath();for(let zi=0;zi<=50;zi++){const p=project(x,zi/50);if(zi)c.lineTo(p.x,p.y);else c.moveTo(p.x,p.y)}c.strokeStyle='rgba(255,75,123,.13)';c.lineWidth=.7;c.stroke()}
   const points=[.1,.3,.5,.7,.9].map(x=>project(x,.52));c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));const route=c.createLinearGradient(points[0].x,0,points[4].x,0);route.addColorStop(0,'#ff4167');route.addColorStop(.5,'#6ee7ff');route.addColorStop(1,'#66e3a4');c.strokeStyle=route;c.lineWidth=2.2;c.shadowColor='#68dcff';c.shadowBlur=12;c.stroke();c.shadowBlur=0;
   points.forEach((p,i)=>{const done=i<completed;const current=i===moduleId-1;c.beginPath();c.arc(p.x,p.y,current?7:4.5,0,Math.PI*2);c.fillStyle=done?'#66e3a4':current?'#fff':'#3d3945';c.fill();c.lineWidth=current?2:1;c.strokeStyle=current?'#ff4167':'rgba(255,255,255,.45)';c.stroke();c.fillStyle=current?'#fff':'rgba(255,255,255,.62)';c.font=`700 ${compact?7:8}px system-ui`;c.textAlign='center';c.fillText(`M${i+1}`,p.x,p.y+20)});
   const stageStart=(moduleId-1)/5;const cursorX=.1+Math.min(.8,stageStart*.8+resolved/Math.max(1,total)*.16);const cursor=project(cursorX,.52);c.beginPath();c.arc(cursor.x,cursor.y,3.2,0,Math.PI*2);c.fillStyle=answered&&!correct?'#ffb14a':'#67e8f9';c.shadowColor=c.fillStyle;c.shadowBlur=15;c.fill();c.shadowBlur=0;
  };
  draw();const resize=()=>draw();const observer=new ResizeObserver(resize);observer.observe(node);addEventListener('resize',resize);return()=>{observer.disconnect();removeEventListener('resize',resize)};
 },[completed,moduleId,resolved,total,answered,correct,compact]);

 return <section className={`mastery-landscape ${compact?'compact':''}`} aria-label={label}>
  <div className="landscape-canvas"><canvas ref={canvas} aria-hidden="true"/><div className="landscape-title"><small>M{moduleId} · {programPercent}% PROGRAM</small><b>{STAGES[moduleId-1]||'PREMIER'}</b></div></div>
  <div className="landscape-metrics" aria-hidden="true"><span><small>PROGRAM</small><b>{completed}<i>/5</i></b></span><span><small>ROUND</small><b>{resolved}<i>/{total}</i></b></span><span><small>REMAINING</small><b>{gap}</b></span><span><small>DECISION</small><b>{decision}<i>/{total}</i></b></span><span><small>STATE</small><b>{state}</b></span></div>
 </section>
}
