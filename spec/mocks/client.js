export class MockClient {
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
