import { ObservationsService } from './observations.service';
import { CreateObservationMediaDto } from './dto/create-observation-media.dto';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
export declare class ObservationsController {
    private readonly observationsService;
    constructor(observationsService: ObservationsService);
    list(req: any): Promise<import("./observation.entity").Observation[]>;
    create(req: any, dto: CreateObservationDto): Promise<import("./observation.entity").Observation>;
    update(req: any, id: string, dto: UpdateObservationDto): Promise<import("./observation.entity").Observation>;
    addMedia(req: any, id: string, dto: CreateObservationMediaDto): Promise<import("./observationMedia.entity").ObservationMedia>;
}
