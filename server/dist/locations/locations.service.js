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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_entity_1 = require("./location.entity");
const project_entity_1 = require("../projects/project.entity");
let LocationsService = class LocationsService {
    constructor(locationsRepository, projectsRepository) {
        this.locationsRepository = locationsRepository;
        this.projectsRepository = projectsRepository;
    }
    async create(tenantId, dto) {
        await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
        const location = this.locationsRepository.create({
            ...dto,
            tenantId,
        });
        return this.locationsRepository.save(location);
    }
    findAllForTenant(tenantId) {
        return this.locationsRepository.find({
            where: { tenantId },
            relations: ['project'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(tenantId, id, dto) {
        const existing = await this.locationsRepository.findOne({
            where: { id, tenantId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Location not found');
        }
        if (dto.projectId) {
            await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
            existing.projectId = dto.projectId;
        }
        if (dto.name !== undefined) {
            existing.name = dto.name;
        }
        return this.locationsRepository.save(existing);
    }
    async remove(tenantId, id) {
        const existing = await this.locationsRepository.findOne({
            where: { id, tenantId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Location not found');
        }
        await this.locationsRepository.remove(existing);
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
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LocationsService);
//# sourceMappingURL=locations.service.js.map