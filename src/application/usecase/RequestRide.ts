// Use Case

import {AccountRepository} from "../../infra/repository/AccountRepository";
import {RideRepository} from "../../infra/repository/RideRepository";
import Ride from "../../domain/Ride";

export default class RequestRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute(input: Input): Promise<Output> {
        const account = await this.accountRepository.getAccountById(input.passengerId);
        if (!account.isPassenger) throw new Error('Account is not from passenger');
        const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
        if (hasActiveRide) throw new Error('Passenger already has an active ride');
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride)
        return {
            rideId: ride.rideId,
        };
    }
}

// DTO
type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

// DTO
type Output = {
    rideId: string
}
