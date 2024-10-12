import { Client } from "../../types/index.js";

export class MockClient implements Client {
    responses;
    callCount = 0;
    constructor(responses) {
        this.responses = responses;
    }
    async request() {
        const response = this.responses[this.callCount % this.responses.length];
        this.callCount++;
        return response;
    }
}
