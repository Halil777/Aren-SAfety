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
exports.Tenant = exports.Plan = exports.BillingStatus = exports.TenantStatus = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const project_entity_1 = require("../projects/project.entity");
const category_entity_1 = require("../categories/category.entity");
const subcategory_entity_1 = require("../subcategories/subcategory.entity");
const department_entity_1 = require("../departments/department.entity");
const type_entity_1 = require("../types/type.entity");
const task_entity_1 = require("../tasks/task.entity");
const company_entity_1 = require("../companies/company.entity");
const mobile_account_entity_1 = require("../mobile-accounts/mobile-account.entity");
const observation_entity_1 = require("../observations/observation.entity");
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "active";
    TenantStatus["TRIAL"] = "trial";
    TenantStatus["SUSPENDED"] = "suspended";
    TenantStatus["DISABLED"] = "disabled";
})(TenantStatus || (exports.TenantStatus = TenantStatus = {}));
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["TRIAL"] = "trial";
    BillingStatus["TRIAL_EXPIRED"] = "trial_expired";
    BillingStatus["PAID"] = "paid";
    BillingStatus["OVERDUE"] = "overdue";
    BillingStatus["CANCELLED"] = "cancelled";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
var Plan;
(function (Plan) {
    Plan["BASIC"] = "basic";
    Plan["PRO"] = "pro";
    Plan["ENTERPRISE"] = "enterprise";
})(Plan || (exports.Plan = Plan = {}));
let Tenant = class Tenant {
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
};
exports.Tenant = Tenant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tenant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Tenant.prototype, "fullname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Tenant.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Tenant.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TenantStatus,
        default: TenantStatus.TRIAL,
    }),
    __metadata("design:type", String)
], Tenant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BillingStatus,
        default: BillingStatus.TRIAL,
    }),
    __metadata("design:type", String)
], Tenant.prototype, "billingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tenant.prototype, "trialEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tenant.prototype, "paidUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Plan, default: Plan.BASIC }),
    __metadata("design:type", String)
], Tenant.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, project => project.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => category_entity_1.Category, category => category.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subcategory_entity_1.Subcategory, subcategory => subcategory.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "subcategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => department_entity_1.Department, department => department.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "departments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => type_entity_1.TypeEntity, type => type.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "types", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, task => task.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => company_entity_1.Company, company => company.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "companies", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => mobile_account_entity_1.MobileAccount, account => account.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "mobileAccounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => observation_entity_1.Observation, observation => observation.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Tenant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Tenant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Tenant.prototype, "hashPassword", null);
exports.Tenant = Tenant = __decorate([
    (0, typeorm_1.Entity)('tenants')
], Tenant);
//# sourceMappingURL=tenant.entity.js.map