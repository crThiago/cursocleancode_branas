// Use Case

import {AccountRepository} from "../../infra/repository/AccountRepository";
import {RideRepository} from "../../infra/repository/RideRepository";
import Ride from "../../domain/entity/Ride";

export default class AcceptRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute(input: Input): Promise<void> {
        const account = await this.accountRepository.getAccountById(input.driverId);
        if (!account.isDriver) throw new Error('Account is not from driver');
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.accept(input.driverId);
        await this.rideRepository.updateRide(ride);
    }
}

// DTO
type Input = {
    rideId: string
    driverId: string
}

