import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Observation } from '../observations/observation.entity';
export declare class Department {
    id: string;
    name: string;
    projectId: string;
    project: Project;
    tenantId: string;
    tenant: Tenant;
    tasks: Task[];
    mobileAccounts: MobileAccount[];
    observations: Observation[];
    createdAt: Date;
    updatedAt: Date;
}
