import { Repository } from 'typeorm';
import { TypeEntity } from './type.entity';
import { Project } from '../projects/project.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
export declare class TypesService {
    private readonly typesRepository;
    private readonly projectsRepository;
    constructor(typesRepository: Repository<TypeEntity>, projectsRepository: Repository<Project>);
    create(tenantId: string, dto: CreateTypeDto): Promise<TypeEntity>;
    findAllForTenant(tenantId: string): Promise<TypeEntity[]>;
    update(tenantId: string, id: string, dto: UpdateTypeDto): Promise<TypeEntity>;
    remove(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
    private ensureProjectBelongsToTenant;
}
