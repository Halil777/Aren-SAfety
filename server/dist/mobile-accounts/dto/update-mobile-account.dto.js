"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMobileAccountDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_mobile_account_dto_1 = require("./create-mobile-account.dto");
class UpdateMobileAccountDto extends (0, mapped_types_1.PartialType)(create_mobile_account_dto_1.CreateMobileAccountDto) {
}
exports.UpdateMobileAccountDto = UpdateMobileAccountDto;
//# sourceMappingURL=update-mobile-account.dto.js.map