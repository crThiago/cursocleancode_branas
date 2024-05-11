// Entity
import Coord from "../vo/Coord";
import Segment from "../vo/Segment";
import RideStatus, {RideStatusFactory} from "../vo/RideStatus";

export default class Position {
    private constructor(
        readonly positionId: string,
        readonly rideId: string,
        readonly coord: Coord,
        readonly date: Date,
    ) {
    }

    // static factory method
    static create(rideId: string, lat: number, long: number) {
        const positionId = crypto.randomUUID();
        const date = new Date();

        return new Position(positionId, rideId, new Coord(lat, long), date);
    }

    // static factory method
    static restore(
        positionId: string, rideId: string, lat: number, long: number, date: Date) {
        return new Position(positionId, rideId, new Coord(lat, long), date);
    }
}
