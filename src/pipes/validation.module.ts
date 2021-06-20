import { Module } from '@nestjs/common';
import { ValidationService } from './validation/validation.service';

@Module({
  providers: [ValidationService],
  exports: [ValidationService]
})
export class ValidationModule {}
