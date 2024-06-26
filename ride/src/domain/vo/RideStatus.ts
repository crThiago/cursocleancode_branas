import Ride from "../entity/Ride";

export default abstract class RideStatus {
    abstract value: string;

    constructor(readonly Ride: Ride) {
    }

    abstract request(): void;
    abstract accept(): void;
    abstract start(): void;
    abstract finish(): void;
}

export class RequestedStatus extends RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        super(ride);
        this.value = 'requested';
    }

    request(): void {
        throw new Error('invalid status');
    }

    accept(): void {
        this.ride.status = new AcceptedStatus(this.ride);
    }

    start(): void {
        throw new Error('invalid status');
    }

    finish(): void {
        throw new Error('invalid status');
    }
}
export class AcceptedStatus extends RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        super(ride);
        this.value = 'accepted';
    }

    request(): void {
        throw new Error('invalid status');
    }

    accept(): void {
        throw new Error('invalid status');
    }

    start(): void {
        this.ride.status = new InProgressStatus(this.ride);
    }

    finish(): void {
        throw new Error('invalid status');
    }
}

export class InProgressStatus extends RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        super(ride);
        this.value = 'in_progress';
    }

    request(): void {
        throw new Error('invalid status');
    }

    accept(): void {
        throw new Error('invalid status');
    }

    start(): void {
        throw new Error('invalid status');
    }

    finish(): void {
        this.ride.status = new FinishedStatus(this.ride);
    }
}

export class FinishedStatus extends RideStatus {
    value: string;

    constructor(readonly ride: Ride) {
        super(ride);
        this.value = 'completed';
    }

    request(): void {
        throw new Error('invalid status');
    }

    accept(): void {
        throw new Error('invalid status');
    }

    start(): void {
        throw new Error('invalid status');
    }

    finish(): void {
        throw new Error('invalid status');
    }
}

export class RideStatusFactory {
    static create(ride: Ride, status: string) {
        if (status === 'requested') return new RequestedStatus(ride);
        if (status === 'accepted') return new AcceptedStatus(ride);
        if (status === 'in_progress') return new InProgressStatus(ride);
        if (status === 'completed') return new FinishedStatus(ride);
        throw new Error();
    }
}
