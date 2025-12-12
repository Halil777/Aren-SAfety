"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const tenants_module_1 = require("./tenants/tenants.module");
const auth_module_1 = require("./auth/auth.module");
const tenant_entity_1 = require("./tenants/tenant.entity");
const messages_module_1 = require("./messages/messages.module");
const message_entity_1 = require("./messages/message.entity");
const projects_module_1 = require("./projects/projects.module");
const project_entity_1 = require("./projects/project.entity");
const categories_module_1 = require("./categories/categories.module");
const category_entity_1 = require("./categories/category.entity");
const subcategory_entity_1 = require("./subcategories/subcategory.entity");
const subcategories_module_1 = require("./subcategories/subcategories.module");
const department_entity_1 = require("./departments/department.entity");
const departments_module_1 = require("./departments/departments.module");
const type_entity_1 = require("./types/type.entity");
const types_module_1 = require("./types/types.module");
const task_entity_1 = require("./tasks/task.entity");
const tasks_module_1 = require("./tasks/tasks.module");
const company_entity_1 = require("./companies/company.entity");
const companies_module_1 = require("./companies/companies.module");
const mobile_account_entity_1 = require("./mobile-accounts/mobile-account.entity");
const mobile_accounts_module_1 = require("./mobile-accounts/mobile-accounts.module");
const mobile_auth_module_1 = require("./mobile-auth/mobile-auth.module");
const observation_entity_1 = require("./observations/observation.entity");
const observationMedia_entity_1 = require("./observations/observationMedia.entity");
const observations_module_1 = require("./observations/observations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_DATABASE', 'safety_platform'),
                    entities: [
                        tenant_entity_1.Tenant,
                        message_entity_1.Message,
                        project_entity_1.Project,
                        category_entity_1.Category,
                        subcategory_entity_1.Subcategory,
                        department_entity_1.Department,
                        type_entity_1.TypeEntity,
                        task_entity_1.Task,
                        company_entity_1.Company,
                        mobile_account_entity_1.MobileAccount,
                        observation_entity_1.Observation,
                        observationMedia_entity_1.ObservationMedia,
                    ],
                    synchronize: configService.get('NODE_ENV') === 'development',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            tenants_module_1.TenantsModule,
            auth_module_1.AuthModule,
            messages_module_1.MessagesModule,
            projects_module_1.ProjectsModule,
            categories_module_1.CategoriesModule,
            subcategories_module_1.SubcategoriesModule,
            departments_module_1.DepartmentsModule,
            types_module_1.TypesModule,
            tasks_module_1.TasksModule,
            companies_module_1.CompaniesModule,
            mobile_accounts_module_1.MobileAccountsModule,
            mobile_auth_module_1.MobileAuthModule,
            observations_module_1.ObservationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map