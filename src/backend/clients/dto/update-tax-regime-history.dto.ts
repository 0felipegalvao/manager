import { PartialType } from '@nestjs/swagger';
import { CreateTaxRegimeHistoryDto } from './create-tax-regime-history.dto';

export class UpdateTaxRegimeHistoryDto extends PartialType(CreateTaxRegimeHistoryDto) {}
