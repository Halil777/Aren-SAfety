import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
export declare class Company {
    id: string;
    companyName: string;
    description?: string | null;
    projectId: string;
    project: Project;
    tenantId: string;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
    mobileAccounts: MobileAccount[];
}
