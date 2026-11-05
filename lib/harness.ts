export const HARNESS_MANIFEST={
 schemaVersion:1,id:'leaaid-cohort-pathway-harness',version:'1.2.0',
 purpose:'Execute source-grounded LEAAID learning through controlled orchestration, testing, and deterministic validation.',
 roles:[
  {id:'learning_orchestrator',may:['check_sequence','delegate_assessment','route_recovery','unlock_next_gate'],mayNot:['author_new_course_claims','override_mastery','reveal_answer_key']},
  {id:'testing_agent',may:['select_authored_item','rotate_answer_order','present_one_item'],mayNot:['score_response','change_source_claim','repeat_recent_item']},
  {id:'validator_agent',may:['compare_option_to_authored_key','return_source_evidence','permit_or_block_advance'],mayNot:['self_grade_with_model_judgment','rewrite_attempt','advance_invalid_response']},
 ],
 controls:{authentication:'anonymous_session',sessionTtlDays:7,identityRequired:false,transcriptRetention:false,answerDisclosure:'after_submission_only',masteryPercent:100,maxOptions:4,failMode:'closed',sourceAuthority:'supplied_foundation_material_only'},
 allowedActions:['describe_program','create_session','coach','launch_multi_agent_training','validate_training_response','launch_training_challenge','submit_answer','launch_applied_lab','submit_lab_choice','launch_premier_challenge','get_session','list_achievements'],
 ethics:{decisionBasis:'authored evidence and exact response only',excludedSignals:['identity','demographics','response_time','number_of_attempts','writing_style','model_inference'],equalRecovery:'unlimited source-grounded recovery without penalty',ranking:false,appeal:'Facilitators can review the cited source and authored key; the validator cannot change either.'},
 transitions:{ready:['coach','launch_multi_agent_training'],assessment_active:['validate_training_response'],module_mastered:['launch_multi_agent_training','launch_applied_lab'],lab_active:['submit_lab_choice'],lab_mastered:['launch_premier_challenge']},
 inputs:{action:'required allowlisted string',session_id:'opaque UUID when state is required',module_id:'integer 1-5 when launching or coaching',option_index:'integer 0-3 only when validating',goal:'understand | apply | prepare'},
 outputs:{result:'action-specific result',control:'guardrail decision and trace identifier',agent_workflow:'role state without hidden reasoning',achievement:'pseudonymous durable verification receipt only after deterministic mastery'},
} as const;

const fields=new Set(['action','session_id','module_id','option_index','goal']);
export function prepareHarnessInput(input:Record<string,unknown>){
 if(!HARNESS_MANIFEST.allowedActions.includes(input.action as never))throw new Error('Harness rejected an action outside the manifest allowlist.');
 const sanitized:Record<string,unknown>={};for(const [key,value] of Object.entries(input))if(fields.has(key))sanitized[key]=value;
 if('module_id'in sanitized&&(!Number.isInteger(Number(sanitized.module_id))||Number(sanitized.module_id)<1||Number(sanitized.module_id)>5))throw new Error('Harness requires module_id from 1 through 5.');
 if('option_index'in sanitized&&(!Number.isInteger(Number(sanitized.option_index))||Number(sanitized.option_index)<0||Number(sanitized.option_index)>3))throw new Error('Harness requires option_index from 0 through 3.');
 return sanitized;
}

export function harnessControl(action:unknown){return{harness_id:HARNESS_MANIFEST.id,manifest_version:HARNESS_MANIFEST.version,trace_id:crypto.randomUUID(),decision:'allowed',action,guardrails:['allowlisted_action','typed_input','source_bounded','answer_non_disclosure','deterministic_progression'],data_policy:{identity:false,transcript:false,expires_days:7}}}
