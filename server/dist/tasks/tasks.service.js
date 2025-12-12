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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./task.entity");
const project_entity_1 = require("../projects/project.entity");
const department_entity_1 = require("../departments/department.entity");
const category_entity_1 = require("../categories/category.entity");
const category_type_1 = require("../categories/category-type");
let TasksService = class TasksService {
    constructor(tasksRepository, projectsRepository, departmentsRepository, categoriesRepository) {
        this.tasksRepository = tasksRepository;
        this.projectsRepository = projectsRepository;
        this.departmentsRepository = departmentsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async create(tenantId, dto) {
        await this.ensureProjectBelongsToTenant(dto.projectId, tenantId);
        await this.ensureDepartmentForTenant(dto.departmentId, tenantId, dto.projectId);
        const category = await this.ensureTaskCategory(dto.categoryId, tenantId, dto.projectId);
        const deadline = this.parseDeadline(dto.deadline);
        const task = this.tasksRepository.create({
            ...dto,
            categoryId: category.id,
            deadline,
            tenantId,
        });
        return this.tasksRepository.save(task);
    }
    findAllForTenant(tenantId) {
        return this.tasksRepository.find({
            where: { tenantId },
            relations: ['project', 'department', 'category'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(tenantId, id, dto) {
        const task = await this.tasksRepository.findOne({
            where: { id, tenantId },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        const projectId = dto.projectId ?? task.projectId;
        await this.ensureProjectBelongsToTenant(projectId, tenantId);
        const departmentId = dto.departmentId ?? task.departmentId;
        await this.ensureDepartmentForTenant(departmentId, tenantId, projectId);
        const categoryId = dto.categoryId ?? task.categoryId;
        const category = await this.ensureTaskCategory(categoryId, tenantId, projectId);
        task.projectId = projectId;
        task.departmentId = departmentId;
        task.categoryId = categoryId;
        if (dto.taskName !== undefined) {
            task.taskName = dto.taskName;
        }
        if (dto.description !== undefined) {
            task.description = dto.description;
        }
        if (dto.deadline !== undefined) {
            task.deadline = this.parseDeadline(dto.deadline);
        }
        return this.tasksRepository.save(task);
    }
    async remove(tenantId, id) {
        const task = await this.tasksRepository.findOne({
            where: { id, tenantId },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        await this.tasksRepository.remove(task);
        return { success: true };
    }
    async ensureProjectBelongsToTenant(projectId, tenantId) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId, tenantId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found for tenant');
        }
        return project;
    }
    async ensureDepartmentForTenant(departmentId, tenantId, projectId) {
        const department = await this.departmentsRepository.findOne({
            where: { id: departmentId, tenantId },
        });
        if (!department || department.projectId !== projectId) {
            throw new common_1.NotFoundException('Department not found for project');
        }
        return department;
    }
    async ensureTaskCategory(categoryId, tenantId, projectId) {
        const category = await this.categoriesRepository.findOne({
            where: { id: categoryId, tenantId, type: category_type_1.CategoryType.TASK },
        });
        if (!category || category.projectId !== projectId) {
            throw new common_1.NotFoundException('Task category not found for project');
        }
        return category;
    }
    parseDeadline(deadline) {
        const parsed = new Date(deadline);
        if (Number.isNaN(parsed.getTime())) {
            throw new common_1.BadRequestException('Invalid deadline');
        }
        return parsed;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(3, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map