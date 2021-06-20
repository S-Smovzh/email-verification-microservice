import { Injectable } from '@nestjs/common';
import validator from 'validator';
import { ValidationErrorCodes } from '../../exceptions/errorCodes/ValidationErrorCodes';
import { GlobalErrorCodes } from '../../exceptions/errorCodes/GlobalErrorCodes';
import { InternalFailure } from '../interfaces/internal-failure.interface';
import { VerifyEmail } from '../interfaces/verify-email.interface';

@Injectable()
export class ValidationService {
  async validateVerificationRequest(data: { email: string; verificationCode: string }) {
    const errors: Partial<VerifyEmail & InternalFailure> = {};

    try {
      if (await this._isEmpty(data.email)) {
        errors.email = {
          message: GlobalErrorCodes.EMPTY_ERROR.value,
          code: GlobalErrorCodes.EMPTY_ERROR.code
        };
      } else if (!validator.isEmail(data.email)) {
        errors.email = {
          message: ValidationErrorCodes.INVALID_EMAIL.value,
          code: ValidationErrorCodes.INVALID_EMAIL.code
        };
      }

      if (await this._isEmpty(data.verificationCode)) {
        errors.verificationCode = {
          message: GlobalErrorCodes.EMPTY_ERROR.value,
          code: GlobalErrorCodes.EMPTY_ERROR.code
        };
      }
    } catch (err) {
      errors.internalFailure = err;
    }

    console.log(errors);

    return {
      errors,
      isValid: await this._isEmpty(errors)
    };
  }

  private async _isEmpty(obj) {
    if (obj !== undefined && obj !== null) {
      const isString = typeof obj === 'string' || obj instanceof String;
      if ((typeof obj === 'number' || obj instanceof Number) && obj !== 0) {
        return false;
      }
      return (
        obj === '' ||
        obj === 0 ||
        (Object.keys(obj).length === 0 && obj.constructor === Object) ||
        obj.length === 0 ||
        (isString && obj.trim().length === 0)
      );
    } else {
      return 'type is undefined or null';
    }
  }
}
