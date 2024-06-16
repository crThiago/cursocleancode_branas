// Entity
import Coord from "../vo/Coord";

export default class Position {
    private constructor(
        readonly positionId: string,
        readonly rideId: string,
        readonly coord: Coord,
        readonly date: Date,
    ) {
    }

    // static factory method
    static create(rideId: string, lat: number, long: number, date: Date) {
        const positionId = crypto.randomUUID();

        return new Position(positionId, rideId, new Coord(lat, long), date);
    }

    // static factory method
    static restore(
        positionId: string, rideId: string, lat: number, long: number, date: Date) {
        return new Position(positionId, rideId, new Coord(lat, long), date);
    }
}
