import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TenantsService } from '../tenants/tenants.service';
import { MobileAccountsService } from '../mobile-accounts/mobile-accounts.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tenantsService: TenantsService,
    private readonly mobileAccountsService: MobileAccountsService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    if (user.role === 'SUPERVISOR') {
      const account = await this.mobileAccountsService.findActiveSupervisorById(
        user.userId,
        user.tenantId,
      );
      if (!account) {
        throw new Error('Supervisor not found');
      }
      const tenant = await this.tenantsService.findOne(account.tenantId);
      await this.tenantsService.ensureTenantAccessState(tenant);
      return {
        id: tenant.id,
        fullname: account.fullName,
        email: account.email,
        phoneNumber: account.phoneNumber,
        status: tenant.status,
        billingStatus: tenant.billingStatus,
        trialEndsAt: tenant.trialEndsAt,
        paidUntil: tenant.paidUntil,
        plan: tenant.plan,
        role: 'SUPERVISOR',
      };
    }

    const tenant = await this.tenantsService.findOne(user.userId);
    await this.tenantsService.ensureTenantAccessState(tenant);
    return { ...tenant, role: 'ADMIN' };
  }
}
