import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private readonly projectRepository;
    constructor(projectRepository: Repository<Project>);
    create(tenantId: string, dto: CreateProjectDto): Promise<Project>;
    findAllForTenant(tenantId: string): Promise<Project[]>;
    update(tenantId: string, id: string, dto: UpdateProjectDto): Promise<Project>;
    remove(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
}
