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
 moduleScores?:number[];
 secondsRemaining?:number;
 active?:boolean;
};

const clamp=(value:number,min=0,max=100)=>Math.min(max,Math.max(min,value));

export default function MasteryLandscape({completed,moduleId=Math.min(5,completed+1),mastered=0,total=10,questionIndex=1,answered=false,correct=false,compact=false,moduleScores,secondsRemaining=45,active=false}:LandscapeProps){
 const canvas=useRef<HTMLCanvasElement>(null);
 const resolved=Math.min(total,mastered);
 const gap=Math.max(0,total-resolved);
 const scores=useMemo(()=>Array.from({length:5},(_,index)=>clamp(moduleScores?.[index]??(index<completed?100:index===moduleId-1?Math.round(resolved/Math.max(1,total)*100):0))),[moduleScores,completed,moduleId,resolved,total]);
 const overall=Math.round(scores.reduce((sum,value)=>sum+value,0)/5);
 const state=answered?(correct?'VERIFIED':'RETRY'):active?'DECIDE':'READY';
 const decision=Math.min(total,Math.max(1,questionIndex));
 const seconds=Math.max(0,Math.round(secondsRemaining));
 const label=useMemo(()=>`Five-module mastery ${overall} percent. Current module ${moduleId}: ${resolved} of ${total} decisions correct, ${gap} remaining. Decision ${decision} of ${total}. ${seconds} seconds. ${state}.`,[overall,moduleId,resolved,total,gap,decision,seconds,state]);

 useEffect(()=>{
  const node=canvas.current;if(!node)return;
  const draw=()=>{
   const box=node.getBoundingClientRect();const dpr=Math.min(2,devicePixelRatio||1);const w=Math.max(300,box.width);const h=Math.max(compact?150:270,box.height);
   if(node.width!==Math.round(w*dpr)||node.height!==Math.round(h*dpr)){node.width=Math.round(w*dpr);node.height=Math.round(h*dpr)}
   const c=node.getContext('2d');if(!c)return;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
   const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#090a10');bg.addColorStop(.62,'#15101b');bg.addColorStop(1,'#32101d');c.fillStyle=bg;c.fillRect(0,0,w,h);
   const left=w*.1;const right=w*.92;const top=h*.2;const bottom=h*.78;const depth=Math.min(44,w*.07);
   const point=(index:number,score:number)=>({x:left+(right-left)*(index/4),y:top+(bottom-top)*(score/100)});
   for(let step=0;step<=4;step++){const y=top+(bottom-top)*(step/4);c.beginPath();c.moveTo(left-depth,y-depth*.35);c.lineTo(right,y);c.strokeStyle=step===4?'rgba(102,227,164,.25)':'rgba(255,255,255,.09)';c.lineWidth=step===4?1.2:.75;c.stroke()}
   for(let index=0;index<5;index++){const x=left+(right-left)*(index/4);c.beginPath();c.moveTo(x-depth,top-depth*.35);c.lineTo(x,bottom);c.strokeStyle='rgba(255,82,107,.12)';c.lineWidth=.7;c.stroke()}
   const points=scores.map((score,index)=>point(index,score));
   c.beginPath();points.forEach((p,index)=>index?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.setLineDash([4,7]);c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;c.stroke();c.setLineDash([]);
   const currentIndex=clamp(moduleId-1,0,4);c.beginPath();points.slice(0,currentIndex+1).forEach((p,index)=>index?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));const route=c.createLinearGradient(left,0,right,0);route.addColorStop(0,'#ff526b');route.addColorStop(.55,'#6ee7ff');route.addColorStop(1,'#66e3a4');c.strokeStyle=route;c.lineWidth=2.5;c.shadowColor='#6ee7ff';c.shadowBlur=10;c.stroke();c.shadowBlur=0;
   points.forEach((p,index)=>{const done=scores[index]===100;const current=index===currentIndex;c.beginPath();c.arc(p.x,p.y,current?7:5,0,Math.PI*2);c.fillStyle=done?'#66e3a4':current?(answered&&!correct?'#ffb14a':'#fff'):'#46414c';c.fill();c.lineWidth=current?2:1;c.strokeStyle=current?'#ff526b':'rgba(255,255,255,.42)';c.stroke();c.textAlign='center';c.fillStyle=current?'#fff':'rgba(255,255,255,.68)';c.font=`800 ${compact?7:9}px system-ui`;c.fillText(`M${index+1}  ${scores[index]}%`,p.x,p.y+(p.y>bottom-22?-16:21))});
   const cursor=points[currentIndex];const radius=active?3.5+Math.min(2,(45-seconds)%4):3.5;c.beginPath();c.arc(cursor.x,cursor.y,radius,0,Math.PI*2);c.fillStyle=answered&&!correct?'#ffb14a':'#67e8f9';c.shadowColor=c.fillStyle;c.shadowBlur=14;c.fill();c.shadowBlur=0;
  };
  draw();const observer=new ResizeObserver(draw);observer.observe(node);addEventListener('resize',draw);return()=>{observer.disconnect();removeEventListener('resize',draw)};
 },[scores,moduleId,answered,correct,compact,active,seconds]);

 return <section className={`mastery-landscape ${compact?'compact':''}`} aria-label={label}>
  <div className="landscape-canvas"><canvas ref={canvas} aria-hidden="true"/><div className="landscape-title"><small>MODULE {moduleId} · DECISION {decision}/{total}</small><b>{overall}% MASTERY</b></div></div>
  <div className="landscape-metrics" aria-hidden="true"><span><small>OVERALL</small><b>{overall}<i>%</i></b></span><span><small>MODULE</small><b>M{moduleId}</b></span><span><small>CORRECT</small><b>{resolved}<i>/{total}</i></b></span><span><small>LEFT</small><b>{gap}</b></span><span><small>TIME</small><b>{active?seconds:'—'}<i>{active?'s':''}</i></b></span></div>
 </section>
}
