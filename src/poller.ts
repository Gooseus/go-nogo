import type { Client, Response, PollerOptions } from './types/index.js';

export class Poller {
  private client: Client;
  private options: PollerOptions;

  constructor(client: Client, options: PollerOptions) {
    this.client = client;
    this.options = options;
  }

  async poll(): Promise<Response> {
    const startTime = Date.now();
    let lastError: Error | undefined;

    while (Date.now() - startTime < this.options.timeout) {
      try {
        const response = await this.client.request(this.options.method, this.options.url);

        const action = this.evaluateResponse(response);

        if (action === 'success') {
          return response;
        } else if (action === 'fail') {
          throw new Error('Received response triggering failure.');
        }
      } catch (error) {
        lastError = error as Error;
      }

      await this.delay(this.options.interval);
    }

    throw lastError || new Error('Polling exceeded timeout.');
  }

  private evaluateResponse(response: Response): 'success' | 'fail' | 'poll' {
    const { expectedResponses } = this.options;

    if (expectedResponses && expectedResponses.length > 0) {
      for (const expected of expectedResponses) {
        const statusMatch = expected.status === undefined || expected.status === response.statusCode;
        const bodyMatch = expected.body === undefined || expected.body === response.body;
        const bodyRegexMatch = expected.bodyRegex === undefined || expected.bodyRegex.test(response.body);

        if (statusMatch && (bodyMatch || bodyRegexMatch)) {
          return expected.action;
        }
      }
    } else {
      // Default behavior
      if (response.statusCode === this.options.expectStatus) {
        if (this.options.expectBody && this.options.expectBody !== response.body) {
          return 'poll';
        }
        if (this.options.expectBodyRegex && !this.options.expectBodyRegex.test(response.body)) {
          return 'poll';
        }
        return 'success';
      }
    }

    return 'poll';
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
