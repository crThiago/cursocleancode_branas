// Use Case
import {RideRepository} from "../../infra/repository/RideRepository";
import {AccountRepository} from "../../infra/repository/AccountRepository";

export default class GetRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {}

    async execute(input: Input): Promise<Output> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const accountPassenger = await this.accountRepository.getAccountById(ride.passengerId);
        let accountDriver;
        if (ride.driverId) {
            accountDriver = await this.accountRepository.getAccountById(ride.driverId);
        }
        return {
            rideId: ride.rideId,
            passengerId: ride.passengerId,
            fromLat: ride.getFromLat(),
            fromLong: ride.getFromLong(),
            toLat: ride.getToLat(),
            toLong: ride.getToLong(),
            status: ride.getStatus(),
            passengerName: accountPassenger.getName(),
            passengerEmail: accountPassenger.getEmail(),
            driverName: accountDriver?.getName(),
            driverEmail: accountDriver?.getEmail(),
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
}
