import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TenantsService } from '../tenants/tenants.service';
export declare class AuthController {
    private readonly authService;
    private readonly tenantsService;
    constructor(authService: AuthService, tenantsService: TenantsService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        tenant: {
            id: string;
            fullname: string;
            email: string;
            phoneNumber: string;
            status: import("../tenants/tenant.entity").TenantStatus.ACTIVE | import("../tenants/tenant.entity").TenantStatus.TRIAL;
            billingStatus: import("../tenants/tenant.entity").BillingStatus;
            trialEndsAt: Date;
            paidUntil: Date;
            plan: import("../tenants/tenant.entity").Plan;
        };
    }>;
    getProfile(user: any): Promise<import("../tenants/tenant.entity").Tenant>;
}
