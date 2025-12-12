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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const categories_service_1 = require("./categories.service");
const category_type_1 = require("./category-type");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    createObservation(req, dto) {
        return this.categoriesService.create(req.user.userId, category_type_1.CategoryType.OBSERVATION, dto);
    }
    findObservation(req) {
        return this.categoriesService.findAllForTenant(req.user.userId, category_type_1.CategoryType.OBSERVATION);
    }
    updateObservation(req, id, dto) {
        return this.categoriesService.update(req.user.userId, id, category_type_1.CategoryType.OBSERVATION, dto);
    }
    removeObservation(req, id) {
        return this.categoriesService.remove(req.user.userId, id, category_type_1.CategoryType.OBSERVATION);
    }
    createTask(req, dto) {
        return this.categoriesService.create(req.user.userId, category_type_1.CategoryType.TASK, dto);
    }
    findTask(req) {
        return this.categoriesService.findAllForTenant(req.user.userId, category_type_1.CategoryType.TASK);
    }
    updateTask(req, id, dto) {
        return this.categoriesService.update(req.user.userId, id, category_type_1.CategoryType.TASK, dto);
    }
    removeTask(req, id) {
        return this.categoriesService.remove(req.user.userId, id, category_type_1.CategoryType.TASK);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)('observation-categories'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "createObservation", null);
__decorate([
    (0, common_1.Get)('observation-categories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findObservation", null);
__decorate([
    (0, common_1.Patch)('observation-categories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "updateObservation", null);
__decorate([
    (0, common_1.Delete)('observation-categories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "removeObservation", null);
__decorate([
    (0, common_1.Post)('task-categories'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)('task-categories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "findTask", null);
__decorate([
    (0, common_1.Patch)('task-categories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)('task-categories/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CategoriesController.prototype, "removeTask", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map