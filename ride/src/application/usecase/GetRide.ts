// Use Case
import {RideRepository} from "../../infra/repository/RideRepository";
import AccountGateway from "../gateway/AccountGateway";

export default class GetRide {

    constructor(readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {}

    async execute(input: Input): Promise<Output> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const accountPassenger = await this.accountGateway.getAccountById(ride.passengerId);
        let accountDriver;
        if (ride.driverId) {
            accountDriver = await this.accountGateway.getAccountById(ride.driverId);
        }
        return {
            rideId: ride.rideId,
            passengerId: ride.passengerId,
            fromLat: ride.getFromLat(),
            fromLong: ride.getFromLong(),
            toLat: ride.getToLat(),
            toLong: ride.getToLong(),
            status: ride.getStatus(),
            passengerName: accountPassenger.name,
            passengerEmail: accountPassenger.email,
            driverName: accountDriver?.name,
            driverEmail: accountDriver?.email,
            distance: ride.distance,
            fare: ride.fare
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
    driverName?: string
    driverEmail?: string
    distance: number,
    fare: number,
}
