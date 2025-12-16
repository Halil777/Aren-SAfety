import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MobileAccountsService } from '../mobile-accounts/mobile-accounts.service';
import { TenantsService } from '../tenants/tenants.service';
import { MobileRole } from '../mobile-accounts/mobile-role';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private mobileAccountsService: MobileAccountsService,
    private tenantsService: TenantsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret-key'),
    });
  }

  async validate(payload: any) {
    try {
      if (payload.role === 'SUPERVISOR') {
        const account = await this.mobileAccountsService.findActiveSupervisorById(
          payload.sub,
          payload.tenantId,
        );
        if (!account) {
          throw new UnauthorizedException('Invalid or inactive supervisor account');
        }
        const tenant = await this.tenantsService.findOne(account.tenantId);
        await this.tenantsService.ensureTenantAccessState(tenant);
        return {
          userId: account.id,
          tenantId: account.tenantId,
          email: account.email,
          status: tenant.status,
          role: MobileRole.SUPERVISOR,
        };
      }

      const tenant = await this.authService.validateTenant(payload.sub);
      return { userId: tenant.id, email: tenant.email, status: tenant.status, role: 'ADMIN' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or inactive account');
    }
  }
}
