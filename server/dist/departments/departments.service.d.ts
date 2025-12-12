import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { Project } from '../projects/project.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsService {
    private readonly departmentsRepository;
    private readonly projectsRepository;
    constructor(departmentsRepository: Repository<Department>, projectsRepository: Repository<Project>);
    create(tenantId: string, dto: CreateDepartmentDto): Promise<Department>;
    findAllForTenant(tenantId: string): Promise<Department[]>;
    update(tenantId: string, id: string, dto: UpdateDepartmentDto): Promise<Department>;
    remove(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
    private ensureProjectBelongsToTenant;
}
