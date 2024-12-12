import { HttpException } from "@nestjs/common";

export class ErrorsHandler {
  private static extractErrorMessage(message: string): string {
    return message.split(":").slice(1).join(":").trim();
  }

  private static parseErrorData(errorMessage: string): any {
    const errorData = JSON.parse(errorMessage);

    if (errorData.response.error?.type === "validation_errors") {
      errorData.response.error.data = JSON.parse(errorData.response.error.data);
    }

    return errorData;
  }

  private static handleHttpException(errorData: any, httpCode: number): void {
    throw new HttpException(errorData, httpCode);
  }
}
