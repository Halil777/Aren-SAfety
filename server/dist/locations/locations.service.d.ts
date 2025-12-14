import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { Project } from '../projects/project.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsService {
    private readonly locationsRepository;
    private readonly projectsRepository;
    constructor(locationsRepository: Repository<Location>, projectsRepository: Repository<Project>);
    create(tenantId: string, dto: CreateLocationDto): Promise<Location>;
    findAllForTenant(tenantId: string): Promise<Location[]>;
    update(tenantId: string, id: string, dto: UpdateLocationDto): Promise<Location>;
    remove(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
    private ensureProjectBelongsToTenant;
}
