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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../tenants/tenant.entity");
const category_entity_1 = require("../categories/category.entity");
const subcategory_entity_1 = require("../subcategories/subcategory.entity");
const department_entity_1 = require("../departments/department.entity");
const type_entity_1 = require("../types/type.entity");
const task_entity_1 = require("../tasks/task.entity");
const company_entity_1 = require("../companies/company.entity");
const mobile_account_entity_1 = require("../mobile-accounts/mobile-account.entity");
const observation_entity_1 = require("../observations/observation.entity");
const location_entity_1 = require("../locations/location.entity");
let Project = class Project {
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "projectClient", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "projectLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "projectHead", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, tenant => tenant.projects, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Project.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => category_entity_1.Category, category => category.project),
    __metadata("design:type", Array)
], Project.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subcategory_entity_1.Subcategory, subcategory => subcategory.project),
    __metadata("design:type", Array)
], Project.prototype, "subcategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => department_entity_1.Department, department => department.project),
    __metadata("design:type", Array)
], Project.prototype, "departments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => type_entity_1.TypeEntity, type => type.project),
    __metadata("design:type", Array)
], Project.prototype, "types", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, task => task.project),
    __metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => company_entity_1.Company, company => company.project),
    __metadata("design:type", Array)
], Project.prototype, "companies", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => mobile_account_entity_1.MobileAccount, account => account.projects),
    __metadata("design:type", Array)
], Project.prototype, "mobileAccounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => observation_entity_1.Observation, observation => observation.project),
    __metadata("design:type", Array)
], Project.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => location_entity_1.Location, location => location.project),
    __metadata("design:type", Array)
], Project.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
//# sourceMappingURL=project.entity.js.map