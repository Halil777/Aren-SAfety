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
exports.ObservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const observation_entity_1 = require("./observation.entity");
const observationMedia_entity_1 = require("./observationMedia.entity");
const observation_status_1 = require("./observation-status");
const mobile_account_entity_1 = require("../mobile-accounts/mobile-account.entity");
const project_entity_1 = require("../projects/project.entity");
const department_entity_1 = require("../departments/department.entity");
const category_entity_1 = require("../categories/category.entity");
const subcategory_entity_1 = require("../subcategories/subcategory.entity");
const mobile_role_1 = require("../mobile-accounts/mobile-role");
const category_type_1 = require("../categories/category-type");
const company_entity_1 = require("../companies/company.entity");
let ObservationsService = class ObservationsService {
    constructor(observationsRepository, mediaRepository, accountsRepository, projectsRepository, departmentsRepository, categoriesRepository, subcategoriesRepository, companiesRepository) {
        this.observationsRepository = observationsRepository;
        this.mediaRepository = mediaRepository;
        this.accountsRepository = accountsRepository;
        this.projectsRepository = projectsRepository;
        this.departmentsRepository = departmentsRepository;
        this.categoriesRepository = categoriesRepository;
        this.subcategoriesRepository = subcategoriesRepository;
        this.companiesRepository = companiesRepository;
    }
    async create(tenantId, creatorId, dto) {
        const creatorAccountId = dto.createdByUserId ?? creatorId;
        const creator = await this.ensureAccount(creatorAccountId, tenantId, mobile_role_1.MobileRole.USER);
        const supervisor = await this.ensureAccount(dto.supervisorId, tenantId, mobile_role_1.MobileRole.SUPERVISOR);
        const company = supervisor.companyId
            ? await this.findCompany(supervisor.companyId, tenantId)
            : null;
        const project = await this.findProject(dto.projectId, tenantId);
        const department = await this.findDepartment(dto.departmentId, tenantId);
        const category = await this.findCategory(dto.categoryId, tenantId);
        const subcategory = await this.findSubcategory(dto.subcategoryId, tenantId, category.id);
        const deadline = this.parseDate(dto.deadline, 'deadline');
        const observation = this.observationsRepository.create({
            ...dto,
            deadline,
            status: dto.status ?? observation_status_1.ObservationStatus.NEW,
            tenantId,
            createdByUserId: creator.id,
            supervisorId: supervisor.id,
            projectId: project.id,
            departmentId: department.id,
            categoryId: category.id,
            subcategoryId: subcategory.id,
            companyId: company?.id ?? null,
        });
        return this.observationsRepository.save(observation);
    }
    findAllForTenant(tenantId) {
        return this.observationsRepository.find({
            where: { tenantId },
            relations: [
                'project',
                'department',
                'category',
                'subcategory',
                'company',
                'createdBy',
                'supervisor',
                'supervisor.company',
            ],
            order: { createdAt: 'DESC' },
        });
    }
    async findForMobile(accountId, role) {
        const where = role === mobile_role_1.MobileRole.USER
            ? { createdByUserId: accountId }
            : { supervisorId: accountId };
        return this.observationsRepository.find({
            where,
            relations: ['project', 'department', 'category', 'subcategory', 'company'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateStatus(tenantId, accountId, role, id, dto) {
        const observation = await this.observationsRepository.findOne({
            where: { id, tenantId },
        });
        if (!observation) {
            throw new common_1.NotFoundException('Observation not found');
        }
        if (role) {
            if (role === mobile_role_1.MobileRole.USER && observation.createdByUserId !== accountId) {
                throw new common_1.BadRequestException('Not allowed to update observation');
            }
            if (role === mobile_role_1.MobileRole.SUPERVISOR && observation.supervisorId !== accountId) {
                throw new common_1.BadRequestException('Not allowed to update observation');
            }
        }
        if (dto.status !== undefined) {
            observation.status = dto.status;
        }
        if (dto.supervisorSeenAt !== undefined) {
            observation.supervisorSeenAt = dto.supervisorSeenAt
                ? this.parseDate(dto.supervisorSeenAt, 'supervisorSeenAt')
                : null;
        }
        if (dto.fixedAt !== undefined) {
            observation.fixedAt = dto.fixedAt ? this.parseDate(dto.fixedAt, 'fixedAt') : null;
        }
        if (dto.closedAt !== undefined) {
            observation.closedAt = dto.closedAt ? this.parseDate(dto.closedAt, 'closedAt') : null;
        }
        if (dto.description !== undefined) {
            observation.description = dto.description;
        }
        return this.observationsRepository.save(observation);
    }
    async addMedia(tenantId, observationId, dto) {
        const observation = await this.observationsRepository.findOne({
            where: { id: observationId, tenantId },
        });
        if (!observation) {
            throw new common_1.NotFoundException('Observation not found');
        }
        const uploader = await this.accountsRepository.findOne({
            where: { id: dto.uploadedByUserId },
        });
        if (!uploader) {
            throw new common_1.NotFoundException('Uploader not found');
        }
        const media = this.mediaRepository.create({
            ...dto,
            observationId,
        });
        return this.mediaRepository.save(media);
    }
    async ensureAccount(id, tenantId, role) {
        const account = await this.accountsRepository.findOne({
            where: { id, tenantId, role, isActive: true },
        });
        if (!account) {
            throw new common_1.NotFoundException('Account not found for tenant');
        }
        return account;
    }
    async findProject(projectId, tenantId) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId, tenantId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found for tenant');
        }
        return project;
    }
    async findDepartment(departmentId, tenantId) {
        const department = await this.departmentsRepository.findOne({
            where: { id: departmentId, tenantId },
        });
        if (!department) {
            throw new common_1.NotFoundException('Department not found for tenant');
        }
        return department;
    }
    async findCategory(categoryId, tenantId) {
        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId, tenantId, type: category_type_1.CategoryType.OBSERVATION },
        });
        if (!category) {
            throw new common_1.NotFoundException('Observation category not found');
        }
        return category;
    }
    async findSubcategory(subcategoryId, tenantId, categoryId) {
        const subcategory = await this.subcategoriesRepository.findOne({
            where: { id: subcategoryId, tenantId, type: category_type_1.CategoryType.OBSERVATION },
        });
        if (!subcategory || subcategory.categoryId !== categoryId) {
            throw new common_1.NotFoundException('Observation subcategory not found');
        }
        return subcategory;
    }
    parseDate(value, field) {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException(`Invalid ${field}`);
        }
        return parsed;
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
};
exports.ObservationsService = ObservationsService;
exports.ObservationsService = ObservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(observation_entity_1.Observation)),
    __param(1, (0, typeorm_1.InjectRepository)(observationMedia_entity_1.ObservationMedia)),
    __param(2, (0, typeorm_1.InjectRepository)(mobile_account_entity_1.MobileAccount)),
    __param(3, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(4, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(5, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(6, (0, typeorm_1.InjectRepository)(subcategory_entity_1.Subcategory)),
    __param(7, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ObservationsService);
//# sourceMappingURL=observations.service.js.map