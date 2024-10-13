import type { Client, Response } from './types/index.js';
import * as http from '@actions/http-client';

export class HttpClient implements Client {
  private client: http.HttpClient;

  constructor() {
    this.client = new http.HttpClient();
  }

  async request(method: string, url: string): Promise<Response> {
    console.log(`Requesting ${method} ${url} in env ${process.env.NODE_ENV}`);
    if (url.includes('localhost')) url = url.replace('localhost', '127.0.0.1');
    if (url.includes('::1')) url = url.replace('::1', '127.0.0.1');

    const response = await this.client.request(method, url, null, {});
    const statusCode = response.message.statusCode || 0;
    const headers = response.message.headers;
    const body = await response.readBody();

    return { statusCode, headers, body };
  }
}
