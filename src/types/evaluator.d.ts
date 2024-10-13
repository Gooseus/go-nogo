export enum EvaluationEnum {
  PASS = 1,
  FAIL = 0,
  HOLD = -1,
}

export type EvaluationResult = [ EvaluationEnum, [ string, string, Error? ]? ]; 
