import * as jq from 'node-jq';
import type { Response, EvaluationEnum, EvaluationResult } from './types/index.js';

export const Evaluations: Record<string, EvaluationEnum> = { PASS: 1, FAIL: 0, HOLD: -1 };
const { PASS, FAIL, HOLD } = Evaluations;

export class Evaluator {
  constructor(private config) {}

  evalStatus(status: string | number): EvaluationResult {
    let { passStatus, failStatus } = this.config;


    if (!Array.isArray(failStatus)) failStatus = [failStatus];
    if (failStatus.map(String).includes(status.toString())) return [ FAIL, [status.toString(), failStatus] ];

    if (!Array.isArray(passStatus)) passStatus = [passStatus];
    if (passStatus.map(String).includes(status.toString())) return [ PASS, [status.toString(), passStatus] ];

    return [ HOLD ];
  }
  
  evalPattern(pattern, check): boolean {
    return pattern instanceof RegExp ? pattern.test(check) : check.includes(pattern);
  }

  evalBody(check): EvaluationResult {
    const { passBodyPattern, failBodyPattern } = this.config;

    if (!passBodyPattern && !failBodyPattern) return [HOLD];

    if (this.evalPattern(failBodyPattern, check)) return [ FAIL, [check, failBodyPattern] ];
    if (this.evalPattern(passBodyPattern, check)) return [ PASS, [check, passBodyPattern] ];

    return [HOLD];
  }

  async evaluate(response: Response): Promise<EvaluationResult> {
    const { passBodyPattern, failBodyPattern, bodyJqFilter } = this.config;
    const { statusCode, body } = response;

    let statusCheck;

    if(this.config.passStatus || this.config.failStatus) {
      statusCheck = this.evalStatus(statusCode);
      if(statusCheck === FAIL) return statusCheck;
    }

    if (bodyJqFilter) {
      try {
        return this.evalBody(await jq.run(bodyJqFilter, body, { input: 'string' }));
      } catch (error) {
        return [ FAIL, [body, bodyJqFilter, error] ];
      }
    }

    if(!passBodyPattern && !failBodyPattern) return statusCheck;

    return this.evalBody(body);
  }
}
