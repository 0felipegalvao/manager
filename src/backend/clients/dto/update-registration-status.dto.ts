import { PartialType } from '@nestjs/swagger';
import { CreateRegistrationStatusDto } from './create-registration-status.dto';

export class UpdateRegistrationStatusDto extends PartialType(CreateRegistrationStatusDto) {}
