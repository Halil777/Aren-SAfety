import { Project } from '../projects/project.entity';
import { Category } from '../categories/category.entity';
import { Subcategory } from '../subcategories/subcategory.entity';
import { Department } from '../departments/department.entity';
import { TypeEntity } from '../types/type.entity';
import { Task } from '../tasks/task.entity';
import { Company } from '../companies/company.entity';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
import { Observation } from '../observations/observation.entity';
export declare enum TenantStatus {
    ACTIVE = "active",
    TRIAL = "trial",
    SUSPENDED = "suspended",
    DISABLED = "disabled"
}
export declare enum BillingStatus {
    TRIAL = "trial",
    TRIAL_EXPIRED = "trial_expired",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}
export declare enum Plan {
    BASIC = "basic",
    PRO = "pro",
    ENTERPRISE = "enterprise"
}
export declare class Tenant {
    id: string;
    fullname: string;
    email: string;
    password: string;
    phoneNumber: string;
    status: TenantStatus;
    billingStatus: BillingStatus;
    trialEndsAt: Date | null;
    paidUntil: Date | null;
    plan: Plan;
    projects: Project[];
    categories: Category[];
    subcategories: Subcategory[];
    departments: Department[];
    types: TypeEntity[];
    tasks: Task[];
    companies: Company[];
    mobileAccounts: MobileAccount[];
    observations: Observation[];
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
