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
exports.MobileDataController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const projects_service_1 = require("../projects/projects.service");
const departments_service_1 = require("../departments/departments.service");
const categories_service_1 = require("../categories/categories.service");
const category_type_1 = require("../categories/category-type");
const mobile_accounts_service_1 = require("./mobile-accounts.service");
const locations_service_1 = require("../locations/locations.service");
let MobileDataController = class MobileDataController {
    constructor(projectsService, departmentsService, categoriesService, mobileAccountsService, locationsService) {
        this.projectsService = projectsService;
        this.departmentsService = departmentsService;
        this.categoriesService = categoriesService;
        this.mobileAccountsService = mobileAccountsService;
        this.locationsService = locationsService;
    }
    async getProjects(req) {
        const projects = await this.projectsService.findAllForTenant(req.user.tenantId);
        return projects.map(p => ({ id: p.id, name: p.name }));
    }
    async getDepartments(req) {
        const departments = await this.departmentsService.findAllForTenant(req.user.tenantId);
        return departments.map(d => ({ id: d.id, name: d.name }));
    }
    async getSupervisors(req) {
        const supervisors = await this.mobileAccountsService.findAllSupervisorsForTenant(req.user.tenantId);
        return supervisors.map(s => ({ id: s.id, fullName: s.fullName }));
    }
    async getLocations(req) {
        const locations = await this.locationsService.findAllForTenant(req.user.tenantId);
        return locations.map(l => ({
            id: l.id,
            name: l.name,
            projectId: l.projectId,
        }));
    }
    async getCategories(req) {
        const categories = await this.categoriesService.findAllForTenant(req.user.tenantId, category_type_1.CategoryType.OBSERVATION);
        return categories.map(c => ({ id: c.id, name: c.categoryName }));
    }
    async getSubcategories(req, categoryId) {
        const categories = await this.categoriesService.findAllForTenant(req.user.tenantId, category_type_1.CategoryType.OBSERVATION);
        if (categoryId) {
            const category = categories.find(c => c.id === categoryId);
            if (!category)
                return [];
            return (category.subcategories || []).map(sc => ({
                id: sc.id,
                name: sc.subcategoryName,
                categoryId: sc.categoryId,
            }));
        }
        return categories.flatMap(c => (c.subcategories || []).map(sc => ({
            id: sc.id,
            name: sc.subcategoryName,
            categoryId: sc.categoryId,
        })));
    }
};
exports.MobileDataController = MobileDataController;
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileDataController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)('departments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileDataController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('supervisors'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileDataController.prototype, "getSupervisors", null);
__decorate([
    (0, common_1.Get)('locations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileDataController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileDataController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('subcategories'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MobileDataController.prototype, "getSubcategories", null);
exports.MobileDataController = MobileDataController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('mobile-jwt')),
    (0, common_1.Controller)('api/mobile'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService,
        departments_service_1.DepartmentsService,
        categories_service_1.CategoriesService,
        mobile_accounts_service_1.MobileAccountsService,
        locations_service_1.LocationsService])
], MobileDataController);
//# sourceMappingURL=mobile-data.controller.js.map