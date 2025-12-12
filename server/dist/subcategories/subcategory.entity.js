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
exports.Subcategory = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../categories/category.entity");
const project_entity_1 = require("../projects/project.entity");
const tenant_entity_1 = require("../tenants/tenant.entity");
const category_type_1 = require("../categories/category-type");
const observation_entity_1 = require("../observations/observation.entity");
let Subcategory = class Subcategory {
};
exports.Subcategory = Subcategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Subcategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: category_type_1.CategoryType, enumName: 'subcategory_type_enum' }),
    __metadata("design:type", String)
], Subcategory.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Subcategory.prototype, "subcategoryName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subcategory.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, category => category.subcategories, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", category_entity_1.Category)
], Subcategory.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subcategory.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, project => project.subcategories, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", project_entity_1.Project)
], Subcategory.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subcategory.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, tenant => tenant.subcategories, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Subcategory.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => observation_entity_1.Observation, observation => observation.subcategory),
    __metadata("design:type", Array)
], Subcategory.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Subcategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Subcategory.prototype, "updatedAt", void 0);
exports.Subcategory = Subcategory = __decorate([
    (0, typeorm_1.Entity)('subcategories')
], Subcategory);
//# sourceMappingURL=subcategory.entity.js.map