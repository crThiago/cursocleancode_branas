// Use Case

import {RideRepository} from "../../infra/repository/RideRepository";
import Ride from "../../domain/entity/Ride";
import AccountGateway from "../gateway/AccountGateway";
import {RabbitMQAdapter} from "../../infra/queue/Queue";

export default class RequestRide {

    constructor(readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {}

    async execute(input: Input): Promise<Output> {
        const account = await this.accountGateway.getAccountById(input.passengerId);
        if (!account.isPassenger) throw new Error('Account is not from passenger');
        const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
        if (hasActiveRide) throw new Error('Passenger already has an active ride');
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride)
        const queue = new RabbitMQAdapter();
        await queue.connect();
        await queue.publish('rideRequested', {
            rideId: ride.rideId,
            passengerId: input.passengerId,
            passengerName: account.name,
            passengerEmail: account.email
        });
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
