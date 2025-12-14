import { Repository } from 'typeorm';
import { MobileAccount } from './mobile-account.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Company } from '../companies/company.entity';
import { CreateMobileAccountDto } from './dto/create-mobile-account.dto';
import { UpdateMobileAccountDto } from './dto/update-mobile-account.dto';
import { MobileRole } from './mobile-role';
import { MailService } from '../notifications/mail.service';
export declare class MobileAccountsService {
    private readonly accountsRepository;
    private readonly projectsRepository;
    private readonly departmentsRepository;
    private readonly companiesRepository;
    private readonly mailService;
    constructor(accountsRepository: Repository<MobileAccount>, projectsRepository: Repository<Project>, departmentsRepository: Repository<Department>, companiesRepository: Repository<Company>, mailService: MailService);
    create(tenantId: string, dto: CreateMobileAccountDto): Promise<MobileAccount>;
    findAll(tenantId: string, role?: MobileRole): Promise<MobileAccount[]>;
    update(tenantId: string, id: string, dto: UpdateMobileAccountDto): Promise<MobileAccount>;
    private ensureLoginUnique;
    private findProjects;
    private findDepartment;
    private findCompany;
    findActiveByLogin(login: string): Promise<MobileAccount>;
    findProfile(accountId: string, tenantId: string): Promise<MobileAccount>;
    findAllSupervisorsForTenant(tenantId: string): Promise<MobileAccount[]>;
    remove(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
}
