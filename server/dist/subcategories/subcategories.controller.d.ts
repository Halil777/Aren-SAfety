import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
export declare class SubcategoriesController {
    private readonly subcategoriesService;
    constructor(subcategoriesService: SubcategoriesService);
    createObservation(req: any, dto: CreateSubcategoryDto): Promise<import("./subcategory.entity").Subcategory>;
    findObservation(req: any): Promise<import("./subcategory.entity").Subcategory[]>;
    updateObservation(req: any, id: string, dto: UpdateSubcategoryDto): Promise<import("./subcategory.entity").Subcategory>;
    removeObservation(req: any, id: string): Promise<{
        success: boolean;
    }>;
    createTask(req: any, dto: CreateSubcategoryDto): Promise<import("./subcategory.entity").Subcategory>;
    findTask(req: any): Promise<import("./subcategory.entity").Subcategory[]>;
    updateTask(req: any, id: string, dto: UpdateSubcategoryDto): Promise<import("./subcategory.entity").Subcategory>;
    removeTask(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
