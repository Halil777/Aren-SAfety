import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(req: any, dto: CreateCompanyDto): Promise<import("./company.entity").Company>;
    findAll(req: any): Promise<import("./company.entity").Company[]>;
    update(req: any, id: string, dto: UpdateCompanyDto): Promise<import("./company.entity").Company>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
