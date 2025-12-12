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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./category.entity");
const project_entity_1 = require("../projects/project.entity");
let CategoriesService = class CategoriesService {
    constructor(categoriesRepository, projectsRepository) {
        this.categoriesRepository = categoriesRepository;
        this.projectsRepository = projectsRepository;
    }
    async create(tenantId, type, dto) {
        await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
        const category = this.categoriesRepository.create({
            ...dto,
            type,
            tenantId,
        });
        return this.categoriesRepository.save(category);
    }
    findAllForTenant(tenantId, type) {
        return this.categoriesRepository.find({
            where: { tenantId, type },
            relations: ['project'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(tenantId, id, type, dto) {
        const category = await this.categoriesRepository.findOne({
            where: { id, tenantId, type },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (dto.projectId) {
            await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
            category.projectId = dto.projectId;
        }
        if (dto.categoryName !== undefined) {
            category.categoryName = dto.categoryName;
        }
        return this.categoriesRepository.save(category);
    }
    async remove(tenantId, id, type) {
        const category = await this.categoriesRepository.findOne({
            where: { id, tenantId, type },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.categoriesRepository.remove(category);
        return { success: true };
    }
    async ensureProjectBelongsToTenant(projectId, tenantId) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId, tenantId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found for tenant');
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map