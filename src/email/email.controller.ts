import { Controller, Post, Body, UseFilters, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { EmailVerificationRequestValidationPipe } from '../pipes/validation/email-verification-request.validation.pipe';
import { InternalExceptionFilter } from '../exceptions/filters/Internal.exception-filter';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailService } from './email.service';

@UseFilters(new InternalExceptionFilter())
@Controller('email')
@ApiTags('Email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send verification mail.' })
  @ApiCreatedResponse({})
  async register(@Req() req: Request, @Body(new EmailVerificationRequestValidationPipe()) verifyEmailDto: VerifyEmailDto) {
    return await this.emailService.validateEmail(verifyEmailDto);
  }
}
