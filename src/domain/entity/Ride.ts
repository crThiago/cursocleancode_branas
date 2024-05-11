// Entity
import Coord from "../vo/Coord";
import Segment from "../vo/Segment";
import RideStatus, {RideStatusFactory} from "../vo/RideStatus";

export default class Ride {
    status : RideStatus
    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        public   driverId: string,
        readonly segment: Segment,
        status: string,
        readonly date: Date
    ) {
        this.status = RideStatusFactory.create(this, status);
    }

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

        return new Ride(rideId, passengerId, '', new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)), status, date);
    }

    // static factory method
    static restore(
        rideId: string,
        passengerId: string,
        driverId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        status: string,
        date: Date
    ) {
        return new Ride(rideId, passengerId, driverId, new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)), status, date);
    }

    accept(driverId: string) {
        this.status.accept();
        this.driverId = driverId;
    }

    start() {
        this.status.start();
    }

    getStatus() {
        return this.status.value;
    }
    getFromLat() {
        return this.segment.from.getLat();
    }

    getFromLong() {
        return this.segment.from.getLong();
    }

    getToLat() {
        return this.segment.to.getLat();
    }

    getToLong() {
        return this.segment.to.getLong();
    }

    getDistance() {
        return this.segment.getDistance();
    }
}
