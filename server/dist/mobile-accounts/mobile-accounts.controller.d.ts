import { MobileAccountsService } from './mobile-accounts.service';
import { CreateMobileAccountDto } from './dto/create-mobile-account.dto';
import { UpdateMobileAccountDto } from './dto/update-mobile-account.dto';
export declare class MobileAccountsController {
    private readonly accountsService;
    constructor(accountsService: MobileAccountsService);
    createUser(req: any, dto: CreateMobileAccountDto): Promise<import("./mobile-account.entity").MobileAccount>;
    createSupervisor(req: any, dto: CreateMobileAccountDto): Promise<import("./mobile-account.entity").MobileAccount>;
    listUsers(req: any): Promise<import("./mobile-account.entity").MobileAccount[]>;
    listSupervisors(req: any): Promise<import("./mobile-account.entity").MobileAccount[]>;
    updateUser(req: any, id: string, dto: UpdateMobileAccountDto): Promise<import("./mobile-account.entity").MobileAccount>;
    updateSupervisor(req: any, id: string, dto: UpdateMobileAccountDto): Promise<import("./mobile-account.entity").MobileAccount>;
}
