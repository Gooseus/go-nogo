import { before, describe, it } from 'node:test';
import assert from 'node:assert';

import { Evaluator, Evaluations } from '../evaluator.js';

const { PASS, FAIL, HOLD } = Evaluations;

describe('Evaluator', () => {
  let evaluator: Evaluator;
  describe('evaluating the status', () => {
    before(() => {
      // Set up the status evaluator
      evaluator = new Evaluator({
        passStatus: [200],
        failStatus: [500],
      });
    });
    it('is a pass when the status code matches a code in passStatus', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: '', headers: {} }), PASS);
    });
    it('is a fail when the status code matches a code in failStatus', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 500, body: '', headers: {} }), FAIL);
    });
    it('is a hold when the status code does not match any code in passStatus or failStatus', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 404, body: '', headers: {} }), HOLD);
    });
  });
  
  describe('evaluating a plain string body', () => {
    before(() => {
      // Set up the simple body evaluator
      evaluator = new Evaluator({
        passStatus: [200],
        passBodyPattern: 'OK',
        failBodyPattern: 'Error',
      });
    });
    it('is a pass when the body matches a simple passBodyPattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: 'OK', headers: {} }), PASS);
    })
    it('is a fail when the body matches a simple failBodyPattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: 'Error', headers: {} }), FAIL);
    });
    it('is a hold when the body does not match any pattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: 'Not Found', headers: {} }), HOLD);
    });
  });

  describe('evaluating a JSON body', () => {
    before(() => {
      // Set up the json body evaluator
      evaluator = new Evaluator({
        passStatus: [200],
        passBodyPattern: 'OK',
        failBodyPattern: 'Error',
        bodyJqFilter: '.data.message',
      });
    });
    it('is a fail when the body is not parseable by jq for the bodyJqFilter', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: 'Not JSON', headers: {} }), FAIL);
    });
    it('is a pass when the bodyJqFilter matches the passBodyPattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: '{"data": {"message": "OK"}}', headers: {} }), PASS);
    });
    it('is a fail when the bodyJqFilter matches the failBodyPattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: '{"data": {"message": "Error"}}', headers: {} }), FAIL);
    });
  });

  describe('evaluating the response body with regex', () => {
    before(() => {
      // Set up the regex body evaluator
      evaluator = new Evaluator({
        passStatus: [200],
        passBodyPattern: /ok/i,
        failBodyPattern: /error/i,
      });
    });
    it('is a pass when the body matches a regex passBodyPattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: 'OK', headers: {} }), PASS);
    })
    it('is a fail when the body matches a regex failBodyPattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: 'Error', headers: {} }), FAIL);
    });
    it('is a hold when the body does not match any pattern', async () => {
      assert.equal(await evaluator.evaluate({ statusCode: 200, body: 'Not Found', headers: {} }), HOLD);
    });
  });
});
