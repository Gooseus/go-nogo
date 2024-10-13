import test from 'node:test';
import assert from 'node:assert';
import type { Response } from '../types/index.js';

import { MockClient } from './mocks/client.js';
import { Poller } from '../poller.js';

const TEST_URL = "http://goose.us";

test('Poller succeeds when expected status and body are received', async () => {
  const responses: Response[] = [
    { statusCode: 404, headers: {}, body: 'Not Found' },
    { statusCode: 200, headers: {}, body: 'OK' },
  ];

  const client = new MockClient(responses);
  const poller = new Poller(client, {
    method: 'GET',
    url: TEST_URL,
    expectStatus: 200,
    timeout: 5000,
    interval: 1000,
  });

  const response = await poller.poll();

  assert.strictEqual(response.statusCode, 200);
});

test('Poller fails when timeout is exceeded', async () => {
  const responses: Response[] = [
    { statusCode: 404, headers: {}, body: 'Not Found' },
    { statusCode: 404, headers: {}, body: 'Not Found Again' },
    { statusCode: 404, headers: {}, body: 'Not Found Again Again' },
  ];

  const client = new MockClient(responses);
  const poller = new Poller(client, {
    method: 'GET',
    url: TEST_URL,
    expectStatus: 200,
    timeout: 2000,
    interval: 1000,
  });

  await assert.rejects(async () => {
    await poller.poll();
  }, { message: 'Polling exceeded timeout.' });
});

test('Poller handles multiple expected responses', async () => {
  const responses: Response[] = [
    { statusCode: 500, headers: {}, body: 'Server Error' },
    { statusCode: 200, headers: {}, body: Math.random() > 0.5 ? 'All Good' : 'OK' },
  ];

  const client = new MockClient(responses);
  const poller = new Poller(client, {
    method: 'GET',
    url: TEST_URL,
    timeout: 5000,
    interval: 1000,
    expectedResponses: [
      { status: 200, body: 'All Good', action: 'success' },
      { status: 200, body: 'OK', action: 'success' },
    ],
  });

  const response = await poller.poll();

  assert.strictEqual(response.statusCode, 200);
  assert.equal(["All Good", "OK"].includes(response.body), true);
});

test('Poller fails on specified failure response', async () => {
  const responses: Response[] = [
    { statusCode: 403, headers: {}, body: 'Forbidden' },
  ];

  const client = new MockClient(responses);
  const poller = new Poller(client, {
    method: 'GET',
    url: TEST_URL,
    timeout: 5000,
    interval: 1000,
    expectedResponses: [
      { status: 403, action: 'fail' },
    ],
  });

  await assert.rejects(async () => {
    await poller.poll();
  }, { message: 'Received response triggering failure.' });
});