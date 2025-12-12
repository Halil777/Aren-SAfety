import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { CategoryType } from './category-type';
import { Observation } from '../observations/observation.entity';
export declare class Category {
    id: string;
    type: CategoryType;
    categoryName: string;
    projectId: string;
    project: Project;
    tenantId: string;
    tenant: Tenant;
    subcategories: Subcategory[];
    observations: Observation[];
    createdAt: Date;
    updatedAt: Date;
}
