import { setOutput, getInput, setFailed } from '@actions/core';

import type { ActionOptions } from './types/index.js';

import { HttpClient } from './http.js';
import { parseInputs } from './utils.js';
import { Evaluator, Evaluations } from './evaluator.js';

const { PASS, FAIL, HOLD } = Evaluations;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    const options: ActionOptions = parseInputs();
    const client = new HttpClient();
    const evaluator = new Evaluator(options);

    const { timeout, interval, method, url, action, outputs } = options;

    const startTime = Date.now();
    let response;

    while (Date.now() - startTime < timeout) {
      response = await client.request(method, url);
      const [result, meta] = await evaluator.evaluate(response)
      const [check, pattern, error] = meta;

      if(error) {
        if (error instanceof Error) throw error;
        if (typeof error === 'string') throw new Error(error);
        throw new Error('Evaluation failed for unknown reason.');
      }

      if (action === "go" && result === PASS) break;
      if (action === "nogo" && result === FAIL) break;
      if (result === HOLD) {
        await this.delay(interval);
        continue;
      }
      throw new Error('Failed to meet expected response criteria.');
    }

    outputs.split(/[\s\t,|;]+/).forEach((output) => setOutput(output, response[output]));
    if(action == "nogo") {
      setFailed('No-go signal caught.');
    }
  } catch (error: unknown) {
    if (error instanceof SyntaxError) setFailed('Invalid JSON in expectedResponses input.');
    if (error instanceof Error) setFailed(error?.message);
    if (typeof error === 'string') setFailed(error);
  }
}

main();
