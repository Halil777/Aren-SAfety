import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): Promise<import("./tenant.entity").Tenant>;
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
    findAll(): Promise<import("./tenant.entity").Tenant[]>;
    findOne(id: string): Promise<import("./tenant.entity").Tenant>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<import("./tenant.entity").Tenant>;
    remove(id: string): Promise<void>;
}
