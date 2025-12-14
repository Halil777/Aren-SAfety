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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileProfileController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const mobile_accounts_service_1 = require("./mobile-accounts.service");
let MobileProfileController = class MobileProfileController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    getProfile(req) {
        return this.accountsService.findProfile(req.user.mobileAccountId, req.user.tenantId).then(account => ({
            id: account.id,
            fullName: account.fullName,
            phoneNumber: account.phoneNumber,
            email: account.email,
            profession: account.profession,
            role: account.role,
            projectName: account.projects?.[0]?.name,
            projects: account.projects?.map(p => ({ id: p.id, name: p.name })) ?? [],
            companyName: account.company?.companyName ?? null,
            company: account.company
                ? { id: account.company.id, name: account.company.companyName }
                : null,
        }));
    }
};
exports.MobileProfileController = MobileProfileController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileProfileController.prototype, "getProfile", null);
exports.MobileProfileController = MobileProfileController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('mobile-jwt')),
    (0, common_1.Controller)('api/mobile/profile'),
    __metadata("design:paramtypes", [mobile_accounts_service_1.MobileAccountsService])
], MobileProfileController);
//# sourceMappingURL=mobile-profile.controller.js.map