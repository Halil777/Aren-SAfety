import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: any, dto: CreateTaskDto): Promise<import("./task.entity").Task>;
    findAll(req: any): Promise<import("./task.entity").Task[]>;
    update(req: any, id: string, dto: UpdateTaskDto): Promise<import("./task.entity").Task>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
