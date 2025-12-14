import { ProjectsService } from '../projects/projects.service';
import { DepartmentsService } from '../departments/departments.service';
import { CategoriesService } from '../categories/categories.service';
import { MobileAccountsService } from './mobile-accounts.service';
import { LocationsService } from '../locations/locations.service';
export declare class MobileDataController {
    private readonly projectsService;
    private readonly departmentsService;
    private readonly categoriesService;
    private readonly mobileAccountsService;
    private readonly locationsService;
    constructor(projectsService: ProjectsService, departmentsService: DepartmentsService, categoriesService: CategoriesService, mobileAccountsService: MobileAccountsService, locationsService: LocationsService);
    getProjects(req: any): Promise<{
        id: string;
        name: string;
    }[]>;
    getDepartments(req: any): Promise<{
        id: string;
        name: string;
    }[]>;
    getSupervisors(req: any): Promise<{
        id: string;
        fullName: string;
    }[]>;
    getLocations(req: any): Promise<{
        id: string;
        name: string;
        projectId: string;
    }[]>;
    getCategories(req: any): Promise<{
        id: string;
        name: string;
    }[]>;
    getSubcategories(req: any, categoryId?: string): Promise<{
        id: string;
        name: string;
        categoryId: string;
    }[]>;
}
