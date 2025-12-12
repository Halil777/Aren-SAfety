"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileAccount = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const tenant_entity_1 = require("../tenants/tenant.entity");
const project_entity_1 = require("../projects/project.entity");
const department_entity_1 = require("../departments/department.entity");
const mobile_role_1 = require("./mobile-role");
const observation_entity_1 = require("../observations/observation.entity");
const observationMedia_entity_1 = require("../observations/observationMedia.entity");
const company_entity_1 = require("../companies/company.entity");
let MobileAccount = class MobileAccount {
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
    async setPassword(raw) {
        this.password = await bcrypt.hash(raw, 10);
    }
};
exports.MobileAccount = MobileAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MobileAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], MobileAccount.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MobileAccount.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MobileAccount.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], MobileAccount.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], MobileAccount.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MobileAccount.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: mobile_role_1.MobileRole, enumName: 'mobile_role_enum' }),
    __metadata("design:type", String)
], MobileAccount.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MobileAccount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MobileAccount.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, tenant => tenant.mobileAccounts, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", tenant_entity_1.Tenant)
], MobileAccount.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MobileAccount.prototype, "departmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.Department, department => department.mobileAccounts, {
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", department_entity_1.Department)
], MobileAccount.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MobileAccount.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, company => company.mobileAccounts, {
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", company_entity_1.Company)
], MobileAccount.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => project_entity_1.Project, project => project.mobileAccounts, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinTable)({
        name: 'mobile_accounts_projects',
        joinColumn: { name: 'account_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'project_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], MobileAccount.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MobileAccount.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MobileAccount.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => observation_entity_1.Observation, observation => observation.createdBy),
    __metadata("design:type", Array)
], MobileAccount.prototype, "createdObservations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => observation_entity_1.Observation, observation => observation.supervisor),
    __metadata("design:type", Array)
], MobileAccount.prototype, "assignedObservations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => observationMedia_entity_1.ObservationMedia, media => media.uploadedBy),
    __metadata("design:type", Array)
], MobileAccount.prototype, "uploadedMedia", void 0);
exports.MobileAccount = MobileAccount = __decorate([
    (0, typeorm_1.Entity)('mobile_accounts')
], MobileAccount);
//# sourceMappingURL=mobile-account.entity.js.map