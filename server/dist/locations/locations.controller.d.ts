import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(req: any, dto: CreateLocationDto): Promise<import("./location.entity").Location>;
    findAll(req: any): Promise<import("./location.entity").Location[]>;
    update(req: any, id: string, dto: UpdateLocationDto): Promise<import("./location.entity").Location>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
