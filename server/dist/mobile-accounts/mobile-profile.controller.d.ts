import { MobileAccountsService } from './mobile-accounts.service';
export declare class MobileProfileController {
    private readonly accountsService;
    constructor(accountsService: MobileAccountsService);
    getProfile(req: any): Promise<{
        id: string;
        fullName: string;
        phoneNumber: string;
        email: string;
        profession: string;
        role: import("./mobile-role").MobileRole;
        projectName: string;
        projects: {
            id: string;
            name: string;
        }[];
        companyName: any;
        company: {
            id: string;
            name: any;
        };
    }>;
}
