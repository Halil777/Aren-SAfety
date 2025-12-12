import { ObservationsService } from './observations.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
export declare class MobileObservationsController {
    private readonly observationsService;
    constructor(observationsService: ObservationsService);
    list(req: any): Promise<import("./observation.entity").Observation[]>;
    create(req: any, dto: CreateObservationDto): Promise<import("./observation.entity").Observation>;
    update(req: any, id: string, dto: UpdateObservationDto): Promise<import("./observation.entity").Observation>;
}
