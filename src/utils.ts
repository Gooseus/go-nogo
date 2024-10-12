import { getInput } from '@actions/core';
import type { PollerOptions, ExpectedResponse } from './types/index.js';

export function parseInputs(): PollerOptions {
  const url = getInput('url', { required: true });
  const method = (getInput('method') || 'get').toUpperCase();
  const timeout = parseInt(getInput('timeout') || '60000');
  const interval = parseInt(getInput('interval') || '1000');
  const expectStatus = parseInt(getInput('expectStatus') || '200');
  const expectBody = getInput('expectBody');
  const expectBodyRegex = getInput('expectBodyRegex');

  const expectedResponsesInput = getInput('expectedResponses');
  const parsedExpectedResponses: ExpectedResponse[] = expectedResponsesInput ? JSON.parse(expectedResponsesInput): [];
  const expectedResponses = parsedExpectedResponses.map((item) => ({
    ...item,
    bodyRegex: item.bodyRegex ? new RegExp(item.bodyRegex) : undefined,
  }));

  return {
    method,
    url,
    expectStatus,
    expectBody,
    expectBodyRegex: expectBodyRegex ? new RegExp(expectBodyRegex) : undefined,
    timeout,
    interval,
    expectedResponses,
  };
}
