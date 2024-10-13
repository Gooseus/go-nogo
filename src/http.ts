import type { Client, Response } from './types/index.js';
import https from 'node:https';

export class HttpClient implements Client {
  async request(method: string, url: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      const req = https.request(url, { method: "GET" }, (res) => {
        const statusCode = res.statusCode;
        const headers = res.headers;
        if(statusCode !== 200) reject(new Error(`Request failed with status code ${statusCode}`));
        let body = '';
        res.on('error', reject);
        res.on('data', (chunk) => { body += chunk.toString(); });
        res.on('end', () => resolve({ statusCode, headers, body }));
      });
      req.on('error', reject);
      req.end();
    });
  }
}
