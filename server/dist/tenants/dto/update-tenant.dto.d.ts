import { BillingStatus, Plan, TenantStatus } from "../tenant.entity";
export declare class UpdateTenantDto {
    fullname?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    status?: TenantStatus;
    billingStatus?: BillingStatus;
    trialEndsAt?: Date;
    paidUntil?: Date;
    plan?: Plan;
}
