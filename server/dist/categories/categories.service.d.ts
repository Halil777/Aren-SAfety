import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryType } from './category-type';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Project } from '../projects/project.entity';
export declare class CategoriesService {
    private readonly categoriesRepository;
    private readonly projectsRepository;
    constructor(categoriesRepository: Repository<Category>, projectsRepository: Repository<Project>);
    create(tenantId: string, type: CategoryType, dto: CreateCategoryDto): Promise<Category>;
    findAllForTenant(tenantId: string, type: CategoryType): Promise<Category[]>;
    update(tenantId: string, id: string, type: CategoryType, dto: UpdateCategoryDto): Promise<Category>;
    remove(tenantId: string, id: string, type: CategoryType): Promise<{
        success: boolean;
    }>;
    private ensureProjectBelongsToTenant;
}
