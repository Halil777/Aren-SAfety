import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
export declare class TypeEntity {
    id: string;
    typeName: string;
    description?: string | null;
    projectId: string;
    project: Project;
    tenantId: string;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
}
