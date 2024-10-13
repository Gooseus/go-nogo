export interface ActionOptions {
  interval: number;
  timeout: number;

  url: string;
  method: string;
  action: string;

  bodyJqFilter?: string;

  failStatus?: number | string;
  passStatus?: number | string;
  failBodyPattern?: RegExp | string;
  passBodyPattern?: RegExp | string;
  
  outputs?: string;
}

export * from './http.js';
export * from './poller.js';
export * from './evaluator.js';