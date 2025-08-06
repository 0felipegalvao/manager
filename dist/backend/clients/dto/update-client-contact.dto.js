"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_client_contact_dto_1 = require("./create-client-contact.dto");
class UpdateClientContactDto extends (0, swagger_1.PartialType)(create_client_contact_dto_1.CreateClientContactDto) {
}
exports.UpdateClientContactDto = UpdateClientContactDto;
//# sourceMappingURL=update-client-contact.dto.js.map