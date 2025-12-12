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
exports.SubcategoriesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const subcategories_service_1 = require("./subcategories.service");
const category_type_1 = require("../categories/category-type");
const create_subcategory_dto_1 = require("./dto/create-subcategory.dto");
const update_subcategory_dto_1 = require("./dto/update-subcategory.dto");
let SubcategoriesController = class SubcategoriesController {
    constructor(subcategoriesService) {
        this.subcategoriesService = subcategoriesService;
    }
    createObservation(req, dto) {
        return this.subcategoriesService.create(req.user.userId, category_type_1.CategoryType.OBSERVATION, dto);
    }
    findObservation(req) {
        return this.subcategoriesService.findAllForTenant(req.user.userId, category_type_1.CategoryType.OBSERVATION);
    }
    updateObservation(req, id, dto) {
        return this.subcategoriesService.update(req.user.userId, id, category_type_1.CategoryType.OBSERVATION, dto);
    }
    removeObservation(req, id) {
        return this.subcategoriesService.remove(req.user.userId, id, category_type_1.CategoryType.OBSERVATION);
    }
    createTask(req, dto) {
        return this.subcategoriesService.create(req.user.userId, category_type_1.CategoryType.TASK, dto);
    }
    findTask(req) {
        return this.subcategoriesService.findAllForTenant(req.user.userId, category_type_1.CategoryType.TASK);
    }
    updateTask(req, id, dto) {
        return this.subcategoriesService.update(req.user.userId, id, category_type_1.CategoryType.TASK, dto);
    }
    removeTask(req, id) {
        return this.subcategoriesService.remove(req.user.userId, id, category_type_1.CategoryType.TASK);
    }
};
exports.SubcategoriesController = SubcategoriesController;
__decorate([
    (0, common_1.Post)('observation-subcategories'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_subcategory_dto_1.CreateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "createObservation", null);
__decorate([
    (0, common_1.Get)('observation-subcategories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "findObservation", null);
__decorate([
    (0, common_1.Patch)('observation-subcategories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_subcategory_dto_1.UpdateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "updateObservation", null);
__decorate([
    (0, common_1.Delete)('observation-subcategories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "removeObservation", null);
__decorate([
    (0, common_1.Post)('task-subcategories'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_subcategory_dto_1.CreateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)('task-subcategories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "findTask", null);
__decorate([
    (0, common_1.Patch)('task-subcategories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_subcategory_dto_1.UpdateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)('task-subcategories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "removeTask", null);
exports.SubcategoriesController = SubcategoriesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [subcategories_service_1.SubcategoriesService])
], SubcategoriesController);
//# sourceMappingURL=subcategories.controller.js.map