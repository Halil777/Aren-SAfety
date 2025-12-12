import { MobileRole } from '../mobile-role';
export declare class CreateMobileAccountDto {
    fullName: string;
    phoneNumber: string;
    email?: string;
    login: string;
    password: string;
    profession?: string;
    role?: MobileRole;
    isActive?: boolean;
    departmentId?: string;
    companyId?: string;
    projectIds: string[];
}
