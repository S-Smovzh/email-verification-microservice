export class ValidationErrorCodes {
  static readonly INVALID_EMAIL = new ValidationErrorCodes('INVALID_EMAIL', 910, 'There is no accounts with such email.');

  private constructor(private readonly key: string, public readonly code: number, public readonly value: string) {}

  toString() {
    return this.key;
  }
}
