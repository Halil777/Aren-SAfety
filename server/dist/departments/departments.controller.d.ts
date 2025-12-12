import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(req: any, dto: CreateDepartmentDto): Promise<import("./department.entity").Department>;
    findAll(req: any): Promise<import("./department.entity").Department[]>;
    update(req: any, id: string, dto: UpdateDepartmentDto): Promise<import("./department.entity").Department>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
