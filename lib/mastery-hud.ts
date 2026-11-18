export type MasteryHudInput={
 completed:number;
 moduleId:number;
 mastered:number;
 total:number;
 questionIndex:number;
 answered:boolean;
 correct:boolean;
 active:boolean;
 secondsRemaining:number;
 moduleScores?:number[];
};

export type HarnessAgentState={className:'live'|'done'|'sleep'|'risk';state:string};

export const clamp=(value:number,min=0,max=100)=>Math.min(max,Math.max(min,value));

export function deriveMasteryHud(input:MasteryHudInput){
 const total=Math.max(1,input.total);
 const moduleId=clamp(Math.round(input.moduleId),1,5);
 const resolved=clamp(Math.round(input.mastered),0,total);
 const scores=Array.from({length:5},(_,index)=>clamp(Math.round(input.moduleScores?.[index]??(index<input.completed?100:index===moduleId-1?resolved/total*100:0))));
 const overall=Math.round(scores.reduce((sum,value)=>sum+value,0)/5);
 const gap=total-resolved;
 const decision=clamp(Math.round(input.questionIndex),1,total);
 const seconds=clamp(Math.round(input.secondsRemaining),0,3600);
 const state=input.answered?(input.correct?'VERIFIED':'RETRY'):input.active?'DECIDE':'READY';
 return{scores,overall,moduleId,resolved,total,gap,decision,seconds,state};
}

export function deriveHarnessAgents({answered,correct}:{answered:boolean;correct:boolean}){
 const complete:HarnessAgentState={className:'done',state:'complete'};
 return{
  orchestrator:complete,
  tester:complete,
  learner:answered?complete:{className:'live',state:'active'} as HarnessAgentState,
  validator:answered?correct?{className:'live',state:'verified'}:{className:'risk',state:'recovery'}:{className:'sleep',state:'standby'} as HarnessAgentState,
 };
}
