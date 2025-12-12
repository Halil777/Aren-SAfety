import { MobileAuthService } from './mobile-auth.service';
import { MobileLoginDto } from './dto/mobile-login.dto';
export declare class MobileAuthController {
    private readonly authService;
    constructor(authService: MobileAuthService);
    login(dto: MobileLoginDto): Promise<{
        access_token: string;
        user_id: string;
        role: import("../mobile-accounts/mobile-role").MobileRole;
    }>;
}
