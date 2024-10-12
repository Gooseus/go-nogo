import { setOutput, setFailed } from '@actions/core';

import type { PollerOptions } from './types/index.js';

import { Poller } from './poller.js';
import { HttpClient } from './http.js';
import { parseInputs } from './utils.js';

async function main() {
  try {
    const options: PollerOptions = parseInputs();
    const client = new HttpClient();
    const poller = new Poller(client, options);

    const response = await poller.poll();

    setOutput('response', response.body);
    setOutput('headers', response.headers);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) setFailed('Invalid JSON in expectedResponses input.');
    if (error instanceof Error) setFailed(error?.message);
    if (typeof error === 'string') setFailed(error);
  }
}

main();
