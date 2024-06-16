// Use Case
import TransactionRepository from "../repository/TransactionRepository";
import Transaction from "../../domain/Transaction";

export default class GetTransaction  {

    constructor(readonly transactionRepository: TransactionRepository) {}

    async execute(transactionId: string): Promise<Output> {
        const transaction =  await this.transactionRepository.get(transactionId)
        return transaction
    }
}

// DTO
type Input = {
    transactionId: string,
}

type Output = {
    transactionId: string,
    rideId: string,
    amount: number,
    status: string,
    date: Date
}

