"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateObligationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_obligation_dto_1 = require("./create-obligation.dto");
class UpdateObligationDto extends (0, swagger_1.PartialType)(create_obligation_dto_1.CreateObligationDto) {
}
exports.UpdateObligationDto = UpdateObligationDto;
//# sourceMappingURL=update-obligation.dto.js.map