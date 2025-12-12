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
exports.MobileAccountsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const mobile_accounts_service_1 = require("./mobile-accounts.service");
const create_mobile_account_dto_1 = require("./dto/create-mobile-account.dto");
const update_mobile_account_dto_1 = require("./dto/update-mobile-account.dto");
const mobile_role_1 = require("./mobile-role");
let MobileAccountsController = class MobileAccountsController {
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    createUser(req, dto) {
        return this.accountsService.create(req.user.userId, {
            ...dto,
            role: mobile_role_1.MobileRole.USER,
        });
    }
    createSupervisor(req, dto) {
        return this.accountsService.create(req.user.userId, {
            ...dto,
            role: mobile_role_1.MobileRole.SUPERVISOR,
        });
    }
    listUsers(req) {
        return this.accountsService.findAll(req.user.userId, mobile_role_1.MobileRole.USER);
    }
    listSupervisors(req) {
        return this.accountsService.findAll(req.user.userId, mobile_role_1.MobileRole.SUPERVISOR);
    }
    updateUser(req, id, dto) {
        return this.accountsService.update(req.user.userId, id, {
            ...dto,
            role: dto.role ?? mobile_role_1.MobileRole.USER,
        });
    }
    updateSupervisor(req, id, dto) {
        return this.accountsService.update(req.user.userId, id, {
            ...dto,
            role: dto.role ?? mobile_role_1.MobileRole.SUPERVISOR,
        });
    }
};
exports.MobileAccountsController = MobileAccountsController;
__decorate([
    (0, common_1.Post)('mobile-users'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_mobile_account_dto_1.CreateMobileAccountDto]),
    __metadata("design:returntype", void 0)
], MobileAccountsController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('supervisors'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_mobile_account_dto_1.CreateMobileAccountDto]),
    __metadata("design:returntype", void 0)
], MobileAccountsController.prototype, "createSupervisor", null);
__decorate([
    (0, common_1.Get)('mobile-users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileAccountsController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Get)('supervisors'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileAccountsController.prototype, "listSupervisors", null);
__decorate([
    (0, common_1.Patch)('mobile-users/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_mobile_account_dto_1.UpdateMobileAccountDto]),
    __metadata("design:returntype", void 0)
], MobileAccountsController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Patch)('supervisors/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_mobile_account_dto_1.UpdateMobileAccountDto]),
    __metadata("design:returntype", void 0)
], MobileAccountsController.prototype, "updateSupervisor", null);
exports.MobileAccountsController = MobileAccountsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [mobile_accounts_service_1.MobileAccountsService])
], MobileAccountsController);
//# sourceMappingURL=mobile-accounts.controller.js.map