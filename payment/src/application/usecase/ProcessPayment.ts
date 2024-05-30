// Use Case

export default class ProcessPayment {

    constructor() {}

    async execute(input: Input): Promise<void> {
        console.log(input.rideId, input.amount);
    }
}

// DTO
type Input = {
    rideId: string,
    amount: number,
}

