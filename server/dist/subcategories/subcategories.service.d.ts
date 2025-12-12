import { Repository } from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Category } from '../categories/category.entity';
import { CategoryType } from '../categories/category-type';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
export declare class SubcategoriesService {
    private readonly subcategoriesRepository;
    private readonly categoriesRepository;
    constructor(subcategoriesRepository: Repository<Subcategory>, categoriesRepository: Repository<Category>);
    create(tenantId: string, type: CategoryType, dto: CreateSubcategoryDto): Promise<Subcategory>;
    findAllForTenant(tenantId: string, type: CategoryType): Promise<Subcategory[]>;
    update(tenantId: string, id: string, type: CategoryType, dto: UpdateSubcategoryDto): Promise<Subcategory>;
    remove(tenantId: string, id: string, type: CategoryType): Promise<{
        success: boolean;
    }>;
    private findCategoryForTenant;
}
