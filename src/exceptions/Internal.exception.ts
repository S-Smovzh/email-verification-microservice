export class InternalException extends Error {
  public response: { key: string; code: number; message: string };

  constructor(public readonly error: { readonly key: string; readonly code: number; readonly message: string }, ...args) {
    super(...args);
    this.response = { key: error.key, code: error.code, message: error.message };
  }
}
