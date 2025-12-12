import { JwtService } from '@nestjs/jwt';
import { MobileAccountsService } from '../mobile-accounts/mobile-accounts.service';
import { MobileLoginDto } from './dto/mobile-login.dto';
export declare class MobileAuthService {
    private readonly accountsService;
    private readonly jwtService;
    constructor(accountsService: MobileAccountsService, jwtService: JwtService);
    login(dto: MobileLoginDto): Promise<{
        access_token: string;
        user_id: string;
        role: import("../mobile-accounts/mobile-role").MobileRole;
    }>;
}
