import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { Project } from '../projects/project.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly companiesRepository;
    private readonly projectsRepository;
    constructor(companiesRepository: Repository<Company>, projectsRepository: Repository<Project>);
    create(tenantId: string, dto: CreateCompanyDto): Promise<Company>;
    findAllForTenant(tenantId: string): Promise<Company[]>;
    update(tenantId: string, id: string, dto: UpdateCompanyDto): Promise<Company>;
    remove(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
    private ensureProjectBelongsToTenant;
}
