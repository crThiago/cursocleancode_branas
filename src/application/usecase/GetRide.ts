// Use Case
import {RideRepository} from "../../infra/repository/RideRepository";
import {AccountRepository} from "../../infra/repository/AccountRepository";

export default class GetRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute(input: Input): Promise<Output> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const account = await this.accountRepository.getAccountById(ride.passengerId);
        return {
            rideId: ride.rideId,
            passengerId: ride.passengerId,
            fromLat: ride.fromLat,
            fromLong: ride.fromLong,
            toLat: ride.toLat,
            toLong: ride.toLong,
            status: ride.status,
            passengerName: account.name,
            passengerEmail: account.email
        };
    }
}

// DTO
type Input = {
    rideId: string
}

// DTO
type Output = {
    rideId: string
    passengerId: string
    fromLat: number
    fromLong: number
    toLat: number
    toLong: number
    status: string
    passengerName: string
    passengerEmail: string
}
