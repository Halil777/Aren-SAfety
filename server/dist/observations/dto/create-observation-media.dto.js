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
exports.CreateObservationMediaDto = void 0;
const class_validator_1 = require("class-validator");
const observationMedia_entity_1 = require("../observationMedia.entity");
class CreateObservationMediaDto {
}
exports.CreateObservationMediaDto = CreateObservationMediaDto;
__decorate([
    (0, class_validator_1.IsEnum)(observationMedia_entity_1.ObservationMediaType),
    __metadata("design:type", String)
], CreateObservationMediaDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateObservationMediaDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateObservationMediaDto.prototype, "uploadedByUserId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateObservationMediaDto.prototype, "isCorrective", void 0);
//# sourceMappingURL=create-observation-media.dto.js.map