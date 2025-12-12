"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const observations_service_1 = require("./observations.service");
const observations_controller_1 = require("./observations.controller");
const mobile_observations_controller_1 = require("./mobile-observations.controller");
const observation_entity_1 = require("./observation.entity");
const observationMedia_entity_1 = require("./observationMedia.entity");
const mobile_account_entity_1 = require("../mobile-accounts/mobile-account.entity");
const project_entity_1 = require("../projects/project.entity");
const department_entity_1 = require("../departments/department.entity");
const category_entity_1 = require("../categories/category.entity");
const subcategory_entity_1 = require("../subcategories/subcategory.entity");
const company_entity_1 = require("../companies/company.entity");
let ObservationsModule = class ObservationsModule {
};
exports.ObservationsModule = ObservationsModule;
exports.ObservationsModule = ObservationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                observation_entity_1.Observation,
                observationMedia_entity_1.ObservationMedia,
                mobile_account_entity_1.MobileAccount,
                project_entity_1.Project,
                department_entity_1.Department,
                category_entity_1.Category,
                subcategory_entity_1.Subcategory,
                company_entity_1.Company,
            ]),
        ],
        controllers: [observations_controller_1.ObservationsController, mobile_observations_controller_1.MobileObservationsController],
        providers: [observations_service_1.ObservationsService],
    })
], ObservationsModule);
//# sourceMappingURL=observations.module.js.map