import { Category } from '../categories/category.entity';
import { Project } from '../projects/project.entity';
import { Tenant } from '../tenants/tenant.entity';
import { CategoryType } from '../categories/category-type';
import { Observation } from '../observations/observation.entity';
export declare class Subcategory {
    id: string;
    type: CategoryType;
    subcategoryName: string;
    categoryId: string;
    category: Category;
    projectId: string;
    project: Project;
    tenantId: string;
    tenant: Tenant;
    observations: Observation[];
    createdAt: Date;
    updatedAt: Date;
}
