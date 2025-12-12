import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
export declare class TypesController {
    private readonly typesService;
    constructor(typesService: TypesService);
    create(req: any, dto: CreateTypeDto): Promise<import("./type.entity").TypeEntity>;
    findAll(req: any): Promise<import("./type.entity").TypeEntity[]>;
    update(req: any, id: string, dto: UpdateTypeDto): Promise<import("./type.entity").TypeEntity>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
