export interface VerifyEmail {
  email: {
    message: string;
    code: number;
  };
  verificationCode: {
    message: string;
    code: number;
  };
}
