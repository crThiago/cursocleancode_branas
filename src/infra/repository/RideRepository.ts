// interface adapter

import pgp from "pg-promise";
import Ride from "../../domain/entity/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export interface RideRepository {
    saveRide(ride: Ride): Promise<any>;
    hasActiveRideByPassengerId(passengerId: string): Promise<any>;
    getRideById(rideId: string): Promise<Ride>;
    updateRide(ride: Ride): Promise<any>;
}


export default class RideRepositoryDatabase implements RideRepository {

    constructor(readonly connection: DatabaseConnection) {
    }

    async saveRide(ride: Ride): Promise<any> {
        await this.connection.query("insert into cccat16.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
            [ride.rideId, ride.passengerId, ride.getStatus(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.date]);
    }

    async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
        const [rideData] = await this.connection.query("select * from cccat16.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
        return !!rideData;
    }

    async getRideById(rideId: string): Promise<Ride> {
        const [rideData] = await this.connection.query("select * from cccat16.ride where ride_id = $1", [rideId]);
        return Ride.restore(
            rideData.ride_id,
            rideData.passenger_id,
            rideData.driver_id,
            parseFloat(rideData.from_lat),
            parseFloat(rideData.from_long),
            parseFloat(rideData.to_lat),
            parseFloat(rideData.to_long),
            rideData.status,
            rideData.date
        );
    }

    async updateRide(ride: Ride): Promise<any> {
        await this.connection.query("update cccat16.ride set driver_id = $1, status = $2 where ride_id = $3",
            [ride.driverId, ride.getStatus(), ride.rideId]);
    }
}
