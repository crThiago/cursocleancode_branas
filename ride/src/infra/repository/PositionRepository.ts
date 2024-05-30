// interface adapter

import pgp from "pg-promise";
import Ride from "../../domain/entity/Ride";
import DatabaseConnection from "../database/DatabaseConnection";
import Position from "../../domain/entity/Position";

export interface PositionRepository {
    savePosition(position: Position): Promise<any>;
}


export default class PositionRepositoryDatabase implements PositionRepository {

    constructor(readonly connection: DatabaseConnection) {
    }

    async savePosition(position: Position): Promise<any> {
        await this.connection.query("insert into cccat16.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
            [position.positionId, position.rideId, position.coord.getLat(), position.coord.getLong(), position.date], true);
    }
}
