export interface PollerOptions {
  interval: number;
  method: string;
  expectStatus?: number;
  expectBody?: string;
  expectBodyRegex?: RegExp;
  expectedResponses?: ExpectedResponse[];
  timeout: number;
  url: string;
}

export interface ExpectedResponse {
  status?: number;
  body?: string;
  bodyRegex?: RegExp;
  action: "success" | "fail" | "poll";
}
