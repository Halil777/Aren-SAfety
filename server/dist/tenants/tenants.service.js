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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("./tenant.entity");
const mail_service_1 = require("../notifications/mail.service");
let TenantsService = class TenantsService {
    constructor(tenantsRepository, mailService) {
        this.tenantsRepository = tenantsRepository;
        this.mailService = mailService;
    }
    async create(createTenantDto) {
        const existingTenant = await this.tenantsRepository.findOne({
            where: { email: createTenantDto.email },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Email already exists');
        }
        const now = new Date();
        const defaultTrialEndsAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14);
        const tenant = this.tenantsRepository.create({
            ...createTenantDto,
            status: createTenantDto.status ?? tenant_entity_1.TenantStatus.TRIAL,
            billingStatus: createTenantDto.billingStatus ?? tenant_entity_1.BillingStatus.TRIAL,
            trialEndsAt: createTenantDto.trialEndsAt
                ? new Date(createTenantDto.trialEndsAt)
                : defaultTrialEndsAt,
            paidUntil: createTenantDto.paidUntil ? new Date(createTenantDto.paidUntil) : null,
            plan: createTenantDto.plan ?? tenant_entity_1.Plan.BASIC,
        });
        const saved = await this.tenantsRepository.save(tenant);
        await this.mailService.sendTenantStatusChange(saved, saved.status);
        return saved;
    }
    async findAll() {
        return this.tenantsRepository.find({
            select: [
                'id',
                'fullname',
                'email',
                'phoneNumber',
                'status',
                'billingStatus',
                'trialEndsAt',
                'paidUntil',
                'plan',
                'createdAt',
                'updatedAt',
            ],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const tenant = await this.tenantsRepository.findOne({
            where: { id },
            select: [
                'id',
                'fullname',
                'email',
                'phoneNumber',
                'status',
                'billingStatus',
                'trialEndsAt',
                'paidUntil',
                'plan',
                'createdAt',
                'updatedAt',
            ],
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async findByEmail(email) {
        return this.tenantsRepository.findOne({ where: { email } });
    }
    async update(id, updateTenantDto) {
        const tenant = await this.tenantsRepository.findOne({ where: { id } });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const previousStatus = tenant.status;
        if (updateTenantDto.email && updateTenantDto.email !== tenant.email) {
            const existingTenant = await this.tenantsRepository.findOne({
                where: { email: updateTenantDto.email },
            });
            if (existingTenant) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        const updateData = { ...updateTenantDto };
        if (!updateTenantDto.password || updateTenantDto.password.trim() === '') {
            delete updateData.password;
        }
        if (updateTenantDto.trialEndsAt) {
            updateData.trialEndsAt = new Date(updateTenantDto.trialEndsAt);
        }
        if (updateTenantDto.paidUntil) {
            updateData.paidUntil = new Date(updateTenantDto.paidUntil);
        }
        Object.assign(tenant, updateData);
        await this.ensureTenantAccessState(tenant);
        const saved = await this.tenantsRepository.save(tenant);
        if (saved.status !== previousStatus) {
            await this.mailService.sendTenantStatusChange(saved, saved.status);
        }
        return saved;
    }
    async remove(id) {
        const tenant = await this.findOne(id);
        await this.tenantsRepository.remove(tenant);
    }
    async getStatistics() {
        const total = await this.tenantsRepository.count();
        const active = await this.tenantsRepository.count({
            where: { status: tenant_entity_1.TenantStatus.ACTIVE },
        });
        const suspended = await this.tenantsRepository.count({
            where: { status: tenant_entity_1.TenantStatus.SUSPENDED },
        });
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const tenantsOverTime = await this.tenantsRepository
            .createQueryBuilder('tenant')
            .select("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'month')
            .addSelect('COUNT(*)', 'count')
            .where('tenant.createdAt >= :sixMonthsAgo', { sixMonthsAgo })
            .groupBy("TO_CHAR(tenant.createdAt, 'YYYY-MM')")
            .orderBy("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'ASC')
            .getRawMany();
        const statusOverTime = await this.tenantsRepository
            .createQueryBuilder('tenant')
            .select("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'month')
            .addSelect('tenant.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('tenant.createdAt >= :sixMonthsAgo', { sixMonthsAgo })
            .groupBy("TO_CHAR(tenant.createdAt, 'YYYY-MM'), tenant.status")
            .orderBy("TO_CHAR(tenant.createdAt, 'YYYY-MM')", 'ASC')
            .getRawMany();
        return {
            total,
            active,
            suspended,
            growthData: tenantsOverTime.map((item) => ({
                month: item.month,
                count: parseInt(item.count, 10),
            })),
            statusData: statusOverTime.map((item) => ({
                month: item.month,
                status: item.status,
                count: parseInt(item.count, 10),
            })),
        };
    }
    async ensureTenantAccessState(tenant) {
        const now = new Date();
        let statusChanged = false;
        let billingChanged = false;
        const trialValid = tenant.billingStatus === tenant_entity_1.BillingStatus.TRIAL &&
            tenant.trialEndsAt !== null &&
            new Date(tenant.trialEndsAt).getTime() > now.getTime();
        const paidValid = tenant.billingStatus === tenant_entity_1.BillingStatus.PAID &&
            tenant.paidUntil !== null &&
            new Date(tenant.paidUntil).getTime() > now.getTime();
        if (tenant.status === tenant_entity_1.TenantStatus.DISABLED) {
            return tenant;
        }
        if (trialValid || paidValid) {
            const nextStatus = tenant.status === tenant_entity_1.TenantStatus.SUSPENDED ? tenant_entity_1.TenantStatus.ACTIVE : tenant.status;
            if (nextStatus !== tenant.status) {
                tenant.status = nextStatus;
                statusChanged = true;
            }
        }
        else {
            if (tenant.billingStatus === tenant_entity_1.BillingStatus.TRIAL &&
                (!tenant.trialEndsAt || new Date(tenant.trialEndsAt).getTime() <= now.getTime())) {
                tenant.billingStatus = tenant_entity_1.BillingStatus.TRIAL_EXPIRED;
                billingChanged = true;
            }
            else if (tenant.billingStatus === tenant_entity_1.BillingStatus.PAID &&
                (!tenant.paidUntil || new Date(tenant.paidUntil).getTime() <= now.getTime())) {
                tenant.billingStatus = tenant_entity_1.BillingStatus.OVERDUE;
                billingChanged = true;
            }
            if (tenant.status !== tenant_entity_1.TenantStatus.SUSPENDED) {
                tenant.status = tenant_entity_1.TenantStatus.SUSPENDED;
                statusChanged = true;
            }
        }
        if (statusChanged || billingChanged) {
            await this.tenantsRepository.save(tenant);
        }
        return tenant;
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mail_service_1.MailService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map