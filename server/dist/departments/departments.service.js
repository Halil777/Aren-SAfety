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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_entity_1 = require("./department.entity");
const project_entity_1 = require("../projects/project.entity");
let DepartmentsService = class DepartmentsService {
    constructor(departmentsRepository, projectsRepository) {
        this.departmentsRepository = departmentsRepository;
        this.projectsRepository = projectsRepository;
    }
    async create(tenantId, dto) {
        await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
        const department = this.departmentsRepository.create({
            ...dto,
            tenantId,
        });
        return this.departmentsRepository.save(department);
    }
    findAllForTenant(tenantId) {
        return this.departmentsRepository.find({
            where: { tenantId },
            relations: ['project'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(tenantId, id, dto) {
        const existing = await this.departmentsRepository.findOne({
            where: { id, tenantId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Department not found');
        }
        if (dto.projectId) {
            await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
            existing.projectId = dto.projectId;
        }
        if (dto.name !== undefined) {
            existing.name = dto.name;
        }
        return this.departmentsRepository.save(existing);
    }
    async remove(tenantId, id) {
        const existing = await this.departmentsRepository.findOne({
            where: { id, tenantId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Department not found');
        }
        await this.departmentsRepository.remove(existing);
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
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map