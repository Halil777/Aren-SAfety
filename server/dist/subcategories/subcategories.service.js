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
exports.SubcategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subcategory_entity_1 = require("./subcategory.entity");
const category_entity_1 = require("../categories/category.entity");
let SubcategoriesService = class SubcategoriesService {
    constructor(subcategoriesRepository, categoriesRepository) {
        this.subcategoriesRepository = subcategoriesRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async create(tenantId, type, dto) {
        const category = await this.findCategoryForTenant(dto.categoryId, tenantId, type);
        const subcategory = this.subcategoriesRepository.create({
            ...dto,
            projectId: category.projectId,
            tenantId,
            type,
        });
        return this.subcategoriesRepository.save(subcategory);
    }
    findAllForTenant(tenantId, type) {
        return this.subcategoriesRepository.find({
            where: { tenantId, type },
            relations: ['project', 'category'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(tenantId, id, type, dto) {
        const subcategory = await this.subcategoriesRepository.findOne({
            where: { id, tenantId, type },
        });
        if (!subcategory) {
            throw new common_1.NotFoundException('Subcategory not found');
        }
        if (dto.categoryId) {
            const category = await this.findCategoryForTenant(dto.categoryId, tenantId, type);
            subcategory.categoryId = category.id;
            subcategory.projectId = category.projectId;
        }
        if (dto.subcategoryName !== undefined) {
            subcategory.subcategoryName = dto.subcategoryName;
        }
        return this.subcategoriesRepository.save(subcategory);
    }
    async remove(tenantId, id, type) {
        const subcategory = await this.subcategoriesRepository.findOne({
            where: { id, tenantId, type },
        });
        if (!subcategory) {
            throw new common_1.NotFoundException('Subcategory not found');
        }
        await this.subcategoriesRepository.remove(subcategory);
        return { success: true };
    }
    async findCategoryForTenant(id, tenantId, type) {
        const category = await this.categoriesRepository.findOne({
            where: { id, tenantId, type },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found for tenant');
        }
        return category;
    }
};
exports.SubcategoriesService = SubcategoriesService;
exports.SubcategoriesService = SubcategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategory_entity_1.Subcategory)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubcategoriesService);
//# sourceMappingURL=subcategories.service.js.map