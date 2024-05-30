// Use Case

import {RideRepository} from "../../infra/repository/RideRepository";
import PaymentGateway from "../gateway/PaymentGateway";
import Registry, {inject} from "../../infra/di/Registry";

export default class FinishRide {
    @inject('RideRepository')
    readonly rideRepository!: RideRepository;
    @inject('PaymentGateway')
    readonly paymentGateway!: PaymentGateway;
    constructor() {}

    async execute(input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.finish();
        await this.rideRepository.updateRide(ride);
        await this.paymentGateway.processPayment({ rideId: ride.rideId, amount: ride.fare });

    }
}

// DTO
type Input = {
    rideId: string
}

