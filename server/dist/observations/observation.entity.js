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
exports.Observation = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../tenants/tenant.entity");
const project_entity_1 = require("../projects/project.entity");
const department_entity_1 = require("../departments/department.entity");
const category_entity_1 = require("../categories/category.entity");
const subcategory_entity_1 = require("../subcategories/subcategory.entity");
const mobile_account_entity_1 = require("../mobile-accounts/mobile-account.entity");
const observation_status_1 = require("./observation-status");
const observationMedia_entity_1 = require("./observationMedia.entity");
const company_entity_1 = require("../companies/company.entity");
let Observation = class Observation {
};
exports.Observation = Observation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Observation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Observation.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, tenant => tenant.observations, { onDelete: 'CASCADE' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Observation.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Observation.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, project => project.observations, { onDelete: 'CASCADE' }),
    __metadata("design:type", project_entity_1.Project)
], Observation.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Observation.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, department => department.observations, { onDelete: 'CASCADE' }),
    __metadata("design:type", department_entity_1.Department)
], Observation.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Observation.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, category => category.observations, { onDelete: 'CASCADE' }),
    __metadata("design:type", category_entity_1.Category)
], Observation.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Observation.prototype, "subcategoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subcategory_entity_1.Subcategory, subcategory => subcategory.observations, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", subcategory_entity_1.Subcategory)
], Observation.prototype, "subcategory", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Observation.prototype, "createdByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mobile_account_entity_1.MobileAccount, account => account.createdObservations, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", mobile_account_entity_1.MobileAccount)
], Observation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Observation.prototype, "supervisorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mobile_account_entity_1.MobileAccount, account => account.assignedObservations, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", mobile_account_entity_1.MobileAccount)
], Observation.prototype, "supervisor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Observation.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, {
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", company_entity_1.Company)
], Observation.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Observation.prototype, "workerFullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Observation.prototype, "workerProfession", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Observation.prototype, "riskLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Observation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Observation.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: observation_status_1.ObservationStatus, enumName: 'observation_status_enum' }),
    __metadata("design:type", String)
], Observation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Observation.prototype, "supervisorSeenAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Observation.prototype, "fixedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Observation.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Observation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Observation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => observationMedia_entity_1.ObservationMedia, media => media.observation),
    __metadata("design:type", Array)
], Observation.prototype, "media", void 0);
exports.Observation = Observation = __decorate([
    (0, typeorm_1.Entity)('observations')
], Observation);
//# sourceMappingURL=observation.entity.js.map