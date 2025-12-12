import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    createObservation(req: any, dto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    findObservation(req: any): Promise<import("./category.entity").Category[]>;
    updateObservation(req: any, id: string, dto: UpdateCategoryDto): Promise<import("./category.entity").Category>;
    removeObservation(req: any, id: string): Promise<{
        success: boolean;
    }>;
    createTask(req: any, dto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    findTask(req: any): Promise<import("./category.entity").Category[]>;
    updateTask(req: any, id: string, dto: UpdateCategoryDto): Promise<import("./category.entity").Category>;
    removeTask(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
