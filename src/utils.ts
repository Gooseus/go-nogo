import { getInput } from '@actions/core';
import type { ActionOptions } from './types/index.js';

export function parseInputs(): ActionOptions {
  const url = getInput('url', { required: true });
  const method = (getInput('method') || 'get').toUpperCase();
  const timeout = parseInt(getInput('timeout') || '60000');
  const interval = parseInt(getInput('interval') || '1000');
  const action = getInput('action') || 'go';
  const passStatus = parseInt(getInput('passStatus') || '200');
  const failStatus = parseInt(getInput('failStatus') || '500');
  const passBodyPattern = getInput('passBodyPattern');
  const failBodyPattern = getInput('failBodyPattern');
  const bodyJqFilter = getInput('bodyJqFilter');
  const outputs = getInput('outputs') || 'all';

  return {
    url,
    method,
    action,
    timeout,
    interval,
    passStatus,
    failStatus,
    passBodyPattern,
    failBodyPattern,
    bodyJqFilter,
    outputs,
  };
}
