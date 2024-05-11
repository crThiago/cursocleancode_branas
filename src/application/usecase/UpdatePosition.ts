// Use Case

import {PositionRepository} from "../../infra/repository/PositionRepository";
import Position from "../../domain/entity/Position";

export default class UpdatePosition {

    constructor(readonly positionRepository: PositionRepository) {}

    async execute(input: Input): Promise<void> {
        const position = Position.create(input.rideId, input.lat, input.long)
        await this.positionRepository.savePosition(position)
    }
}

// DTO
type Input = {
    rideId: string
    lat: number
    long: number
}

