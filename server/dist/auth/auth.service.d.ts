import { JwtService } from '@nestjs/jwt';
import { TenantsService } from '../tenants/tenants.service';
import { BillingStatus, TenantStatus } from '../tenants/tenant.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private tenantsService;
    private jwtService;
    constructor(tenantsService: TenantsService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        tenant: {
            id: string;
            fullname: string;
            email: string;
            phoneNumber: string;
            status: TenantStatus.ACTIVE | TenantStatus.TRIAL;
            billingStatus: BillingStatus;
            trialEndsAt: Date;
            paidUntil: Date;
            plan: import("../tenants/tenant.entity").Plan;
        };
    }>;
    validateTenant(id: string): Promise<import("../tenants/tenant.entity").Tenant>;
}
