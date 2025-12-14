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
exports.MobileObservationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const observations_service_1 = require("./observations.service");
const create_observation_dto_1 = require("./dto/create-observation.dto");
const update_observation_dto_1 = require("./dto/update-observation.dto");
const mobile_role_1 = require("../mobile-accounts/mobile-role");
const answer_observation_dto_1 = require("./dto/answer-observation.dto");
let MobileObservationsController = class MobileObservationsController {
    constructor(observationsService) {
        this.observationsService = observationsService;
    }
    list(req) {
        return this.observationsService.findForMobile(req.user.mobileAccountId, req.user.role);
    }
    getOne(req, id) {
        return this.observationsService.findOneForMobile(req.user.mobileAccountId, req.user.role, id);
    }
    create(req, dto) {
        if (req.user.role !== mobile_role_1.MobileRole.USER) {
            throw new Error('Only users can create observations');
        }
        return this.observationsService.create(req.user.tenantId, req.user.mobileAccountId, dto);
    }
    update(req, id, dto) {
        return this.observationsService.updateStatus(req.user.tenantId, req.user.mobileAccountId, req.user.role, id, dto);
    }
    answer(req, id, dto) {
        return this.observationsService.answerObservation(req.user.tenantId, req.user.mobileAccountId, req.user.role, id, dto);
    }
};
exports.MobileObservationsController = MobileObservationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileObservationsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MobileObservationsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_observation_dto_1.CreateObservationDto]),
    __metadata("design:returntype", void 0)
], MobileObservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_observation_dto_1.UpdateObservationDto]),
    __metadata("design:returntype", void 0)
], MobileObservationsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/answer'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, answer_observation_dto_1.AnswerObservationDto]),
    __metadata("design:returntype", void 0)
], MobileObservationsController.prototype, "answer", null);
exports.MobileObservationsController = MobileObservationsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('mobile-jwt')),
    (0, common_1.Controller)('api/mobile/observations'),
    __metadata("design:paramtypes", [observations_service_1.ObservationsService])
], MobileObservationsController);
//# sourceMappingURL=mobile-observations.controller.js.map