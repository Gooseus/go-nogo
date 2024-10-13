# Go/no-go GitHub Action

> [!NOTE]
> Project forked from/inspired by https://github.com/artiz/poll-endpoint and https://github.com/emilioschepis/wait-for-endpoint, many thanks!

> [!CAUTION]
> Currently WIP and not yet published, likely things wrong/inaccureate, do not use.

This action polls a specified HTTP or HTTPS endpoint until it responds with the expected status code or the timeout is exceeded.

This action can be particularly useful to check the status of a container launched with the `-d` flag as part of a CI workflow, or a service container that lies about its readiness, or, eventually, to wait for any kind of signals to proceed sucessfully, continue to wait, or eventually fail.

That last bit is a work in progress, but for now you should be able to poll an enpoint on an interval for a certain amount of time before either failing or proceeding.

## Inputs

### `url`

**Required** The URL to poll.

### `method`

**Optional** The HTTP method to use. Default `"GET"`.

### `expectStatus`

**Optional** The HTTP status that is expected. Default `"200"`.

### `expectBody`

**Optional** Response body that is expected.

### `expectBodyRegex`

**Optional** Regex to match expected response body

### `timeout`

**Optional** The maximum time the polling is allowed to run for (in milliseconds). Default `"60000"`.

### `interval`

**Optional** The interval at which the polling should happen (in milliseconds). Default `"1000"`.

## Example usage (when available)

```yml
uses: gooseus/go-nogo@0.9.1
with:
  url: http://localhost:8080/healthz
  method: GET
  expect-status: 200
  expect-response-regex: "\"status\":\"(OK|SUCCESS)\""
  timeout: 60000
  interval: 1000
```
