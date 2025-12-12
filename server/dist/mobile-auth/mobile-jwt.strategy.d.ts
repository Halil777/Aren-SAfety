import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { MobileAccount } from '../mobile-accounts/mobile-account.entity';
declare const MobileJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class MobileJwtStrategy extends MobileJwtStrategy_base {
    private readonly accountsRepository;
    constructor(configService: ConfigService, accountsRepository: Repository<MobileAccount>);
    validate(payload: any): Promise<{
        userId: string;
        mobileAccountId: string;
        role: any;
        tenantId: string;
    }>;
}
export {};
