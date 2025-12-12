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
exports.MobileAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mobile_account_entity_1 = require("./mobile-account.entity");
const project_entity_1 = require("../projects/project.entity");
const department_entity_1 = require("../departments/department.entity");
const company_entity_1 = require("../companies/company.entity");
const mobile_role_1 = require("./mobile-role");
let MobileAccountsService = class MobileAccountsService {
    constructor(accountsRepository, projectsRepository, departmentsRepository, companiesRepository) {
        this.accountsRepository = accountsRepository;
        this.projectsRepository = projectsRepository;
        this.departmentsRepository = departmentsRepository;
        this.companiesRepository = companiesRepository;
    }
    async create(tenantId, dto) {
        await this.ensureLoginUnique(dto.login);
        const projects = await this.findProjects(dto.projectIds, tenantId);
        const department = dto.departmentId
            ? await this.findDepartment(dto.departmentId, tenantId)
            : undefined;
        const company = dto.companyId ? await this.findCompany(dto.companyId, tenantId) : undefined;
        const account = this.accountsRepository.create({
            ...dto,
            tenantId,
            role: dto.role ?? mobile_role_1.MobileRole.USER,
            departmentId: department?.id,
            companyId: company?.id,
            projects,
        });
        await account.setPassword(dto.password);
        return this.accountsRepository.save(account);
    }
    async findAll(tenantId, role) {
        return this.accountsRepository.find({
            where: { tenantId, ...(role ? { role } : {}) },
            relations: ['projects', 'department', 'company'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(tenantId, id, dto) {
        const account = await this.accountsRepository.findOne({
            where: { id, tenantId },
            relations: ['projects'],
        });
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        if (dto.login && dto.login !== account.login) {
            await this.ensureLoginUnique(dto.login);
            account.login = dto.login;
        }
        if (dto.fullName !== undefined)
            account.fullName = dto.fullName;
        if (dto.phoneNumber !== undefined)
            account.phoneNumber = dto.phoneNumber;
        if (dto.email !== undefined)
            account.email = dto.email;
        if (dto.profession !== undefined)
            account.profession = dto.profession;
        if (dto.isActive !== undefined)
            account.isActive = dto.isActive;
        if (dto.role !== undefined)
            account.role = dto.role;
        if (dto.password) {
            await account.setPassword(dto.password);
        }
        if (dto.departmentId !== undefined) {
            account.departmentId = dto.departmentId
                ? (await this.findDepartment(dto.departmentId, tenantId)).id
                : null;
        }
        if (dto.companyId !== undefined) {
            account.companyId = dto.companyId ? (await this.findCompany(dto.companyId, tenantId)).id : null;
        }
        if (dto.projectIds) {
            account.projects = await this.findProjects(dto.projectIds, tenantId);
        }
        return this.accountsRepository.save(account);
    }
    async ensureLoginUnique(login) {
        const existing = await this.accountsRepository.findOne({ where: { login } });
        if (existing) {
            throw new common_1.ConflictException('Login already in use');
        }
    }
    async findProjects(ids, tenantId) {
        if (!ids?.length) {
            throw new common_1.BadRequestException('At least one project is required');
        }
        const projects = await this.projectsRepository.find({
            where: { id: (0, typeorm_2.In)(ids), tenantId },
        });
        if (projects.length !== ids.length) {
            throw new common_1.NotFoundException('One or more projects not found for tenant');
        }
        return projects;
    }
    async findDepartment(id, tenantId) {
        const department = await this.departmentsRepository.findOne({
            where: { id, tenantId },
        });
        if (!department) {
            throw new common_1.NotFoundException('Department not found for tenant');
        }
        return department;
    }
    async findCompany(id, tenantId) {
        const company = await this.companiesRepository.findOne({
            where: { id, tenantId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found for tenant');
        }
        return company;
    }
    async findActiveByLogin(login) {
        return this.accountsRepository.findOne({
            where: { login, isActive: true },
            relations: ['projects'],
        });
    }
};
exports.MobileAccountsService = MobileAccountsService;
exports.MobileAccountsService = MobileAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mobile_account_entity_1.MobileAccount)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(3, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MobileAccountsService);
//# sourceMappingURL=mobile-accounts.service.js.map