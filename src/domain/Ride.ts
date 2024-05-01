// Entity
export default class Ride {
    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number,
        readonly status: string,
        readonly date: Date
    ) {}

    // static factory method
    static create(
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
    ) {
        const rideId = crypto.randomUUID();
        const status = 'requested';
        const date = new Date();

        return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
    }

    // static factory method
    static restore(
        rideId: string,
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        status: string,
        date: Date
    ) {
        return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
    }

}
