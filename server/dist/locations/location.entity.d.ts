import { Project } from '../projects/project.entity';
import { Tenant } from '../tenants/tenant.entity';
export declare class Location {
    id: string;
    name: string;
    projectId: string;
    project: Project;
    tenantId: string;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
}
