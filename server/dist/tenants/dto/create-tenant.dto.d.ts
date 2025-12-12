import { BillingStatus, Plan, TenantStatus } from "../tenant.entity";
export declare class CreateTenantDto {
    fullname: string;
    email: string;
    password: string;
    phoneNumber?: string;
    status?: TenantStatus;
    billingStatus?: BillingStatus;
    trialEndsAt?: Date;
    paidUntil?: Date;
    plan?: Plan;
}
