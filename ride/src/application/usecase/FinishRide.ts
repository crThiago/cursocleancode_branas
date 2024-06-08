// Use Case

import {RideRepository} from "../../infra/repository/RideRepository";
import PaymentGateway from "../gateway/PaymentGateway";
import {inject} from "../../infra/di/Registry";
import DomainEvent from "../../domain/event/DomainEvent";
import Mediator from "../../infra/mediator/Mediator";
import Queue from "../../infra/queue/Queue";

export default class FinishRide {
    @inject('RideRepository')
    readonly rideRepository!: RideRepository;
    @inject('PaymentGateway')
    readonly paymentGateway!: PaymentGateway;
    @inject('Mediator')
    readonly mediator!: Mediator;
    @inject('Queue')
    readonly queue!: Queue;
    constructor() {}

    async execute(input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.register('rideCompleted', async (domainEvent: DomainEvent) => {
            // await this.mediator.publish(domainEvent.eventName, domainEvent.data);
            await this.queue.publish(domainEvent.eventName, domainEvent.data);
        });
        ride.finish();
        await this.rideRepository.updateRide(ride);
        // await this.paymentGateway.processPayment({ rideId: ride.rideId, amount: ride.fare });

    }
}

// DTO
type Input = {
    rideId: string
}

