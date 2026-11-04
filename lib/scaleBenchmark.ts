export const SCALE_BENCHMARK = {
  label:'1,000 learner randomized proficiency swarm',
  learners:1000,
  rounds:10000,
  decisions:250000,
  accuracy:78.7,
  p95DurationMs:741543,
  tiers:{developing:292,bronze:188,silver:205,gold:230,premier:85},
  domains:{
    1:{answered:50000,correct:39493},
    2:{answered:50000,correct:39269},
    3:{answered:50000,correct:39346},
    4:{answered:50000,correct:39354},
    5:{answered:50000,correct:39307},
  },
  synthetic:true,
} as const;
