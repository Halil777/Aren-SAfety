import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: any, createProjectDto: CreateProjectDto): Promise<import("./project.entity").Project>;
    findAll(req: any): Promise<import("./project.entity").Project[]>;
    update(req: any, id: string, updateProjectDto: UpdateProjectDto): Promise<import("./project.entity").Project>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
