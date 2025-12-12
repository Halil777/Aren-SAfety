import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { MailService } from '../notifications/mail.service';
export declare class TenantsService {
    private tenantsRepository;
    private readonly mailService;
    constructor(tenantsRepository: Repository<Tenant>, mailService: MailService);
    create(createTenantDto: CreateTenantDto): Promise<Tenant>;
    findAll(): Promise<Tenant[]>;
    findOne(id: string): Promise<Tenant>;
    findByEmail(email: string): Promise<Tenant | null>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        total: number;
        active: number;
        suspended: number;
        growthData: {
            month: any;
            count: number;
        }[];
        statusData: {
            month: any;
            status: any;
            count: number;
        }[];
    }>;
    ensureTenantAccessState(tenant: Tenant): Promise<Tenant>;
}
