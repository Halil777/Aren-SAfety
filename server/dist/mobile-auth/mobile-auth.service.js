"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mobile_accounts_service_1 = require("../mobile-accounts/mobile-accounts.service");
let MobileAuthService = class MobileAuthService {
    constructor(accountsService, jwtService) {
        this.accountsService = accountsService;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const account = await this.accountsService.findActiveByLogin(dto.login);
        if (!account) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await account.validatePassword(dto.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: account.id,
            role: account.role,
            tenantId: account.tenantId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user_id: account.id,
            role: account.role,
        };
    }
};
exports.MobileAuthService = MobileAuthService;
exports.MobileAuthService = MobileAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mobile_accounts_service_1.MobileAccountsService,
        jwt_1.JwtService])
], MobileAuthService);
//# sourceMappingURL=mobile-auth.service.js.map