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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationMedia = exports.ObservationMediaType = void 0;
const typeorm_1 = require("typeorm");
const observation_entity_1 = require("./observation.entity");
const mobile_account_entity_1 = require("../mobile-accounts/mobile-account.entity");
var ObservationMediaType;
(function (ObservationMediaType) {
    ObservationMediaType["IMAGE"] = "IMAGE";
    ObservationMediaType["VIDEO"] = "VIDEO";
})(ObservationMediaType || (exports.ObservationMediaType = ObservationMediaType = {}));
let ObservationMedia = class ObservationMedia {
};
exports.ObservationMedia = ObservationMedia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ObservationMedia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ObservationMedia.prototype, "observationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => observation_entity_1.Observation, observation => observation.media, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", observation_entity_1.Observation)
], ObservationMedia.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ObservationMediaType, enumName: 'observation_media_type_enum' }),
    __metadata("design:type", String)
], ObservationMedia.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ObservationMedia.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ObservationMedia.prototype, "uploadedByUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mobile_account_entity_1.MobileAccount, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", mobile_account_entity_1.MobileAccount)
], ObservationMedia.prototype, "uploadedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ObservationMedia.prototype, "isCorrective", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ObservationMedia.prototype, "createdAt", void 0);
exports.ObservationMedia = ObservationMedia = __decorate([
    (0, typeorm_1.Entity)('observation_media')
], ObservationMedia);
//# sourceMappingURL=observationMedia.entity.js.map