"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mobile_accounts_service_1 = require("./mobile-accounts.service");
const mobile_accounts_controller_1 = require("./mobile-accounts.controller");
const mobile_account_entity_1 = require("./mobile-account.entity");
const project_entity_1 = require("../projects/project.entity");
const department_entity_1 = require("../departments/department.entity");
const company_entity_1 = require("../companies/company.entity");
const mobile_profile_controller_1 = require("./mobile-profile.controller");
const mobile_data_controller_1 = require("./mobile-data.controller");
const projects_module_1 = require("../projects/projects.module");
const departments_module_1 = require("../departments/departments.module");
const categories_module_1 = require("../categories/categories.module");
const notifications_module_1 = require("../notifications/notifications.module");
const locations_module_1 = require("../locations/locations.module");
let MobileAccountsModule = class MobileAccountsModule {
};
exports.MobileAccountsModule = MobileAccountsModule;
exports.MobileAccountsModule = MobileAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([mobile_account_entity_1.MobileAccount, project_entity_1.Project, department_entity_1.Department, company_entity_1.Company]),
            projects_module_1.ProjectsModule,
            departments_module_1.DepartmentsModule,
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
            locations_module_1.LocationsModule,
        ],
        controllers: [mobile_accounts_controller_1.MobileAccountsController, mobile_profile_controller_1.MobileProfileController, mobile_data_controller_1.MobileDataController],
        providers: [mobile_accounts_service_1.MobileAccountsService],
        exports: [mobile_accounts_service_1.MobileAccountsService],
    })
], MobileAccountsModule);
//# sourceMappingURL=mobile-accounts.module.js.map