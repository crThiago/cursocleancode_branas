export default class Transaction {
    constructor(
        readonly transactionId: string,
        readonly rideId: string,
        readonly amount: number,
        public status: string,
        readonly date: Date
    ) {}

    static create(rideId: string, amount: number) {
        const transactionId = crypto.randomUUID();
        const date = new Date();
        const status = 'pending';
        return new Transaction(transactionId, rideId, amount, status, date);
    }

    approve() {
        this.status = 'approved';
    }

    reject() {
        this.status = 'rejected';
    }
}
