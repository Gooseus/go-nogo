type Headers = Record<string, string | string[]>;

export interface Client {
  request(method: string, url: string, body?: string, headers?: Headers): Promise<Response>;
}

export interface Response {
  statusCode: number;
  headers: Headers;
  body: string;
}