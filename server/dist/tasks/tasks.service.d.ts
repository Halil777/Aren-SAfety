import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Project } from '../projects/project.entity';
import { Department } from '../departments/department.entity';
import { Category } from '../categories/category.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private readonly tasksRepository;
    private readonly projectsRepository;
    private readonly departmentsRepository;
    private readonly categoriesRepository;
    constructor(tasksRepository: Repository<Task>, projectsRepository: Repository<Project>, departmentsRepository: Repository<Department>, categoriesRepository: Repository<Category>);
    create(tenantId: string, dto: CreateTaskDto): Promise<Task>;
    findAllForTenant(tenantId: string): Promise<Task[]>;
    update(tenantId: string, id: string, dto: UpdateTaskDto): Promise<Task>;
    remove(tenantId: string, id: string): Promise<{
        success: boolean;
    }>;
    private ensureProjectBelongsToTenant;
    private ensureDepartmentForTenant;
    private ensureTaskCategory;
    private parseDeadline;
}
