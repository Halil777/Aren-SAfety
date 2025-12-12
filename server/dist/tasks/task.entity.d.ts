import { Tenant } from '../tenants/tenant.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
export declare class Task {
    id: string;
    taskName: string;
    description?: string | null;
    deadline: Date;
    projectId: string;
    project: Project;
    departmentId: string;
    department: Department;
    categoryId: string;
    category: Category;
    tenantId: string;
    tenant: Tenant;
    createdAt: Date;
    updatedAt: Date;
}
