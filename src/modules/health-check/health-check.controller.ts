import { Controller, Get, HttpStatus, InternalServerErrorException } from "@nestjs/common";

@Controller()
export class HealthCheckController {
  @Get("health")
  async checkLiveness(): Promise<HttpStatus> {
    try {
      return HttpStatus.OK;
    } catch {
      throw new InternalServerErrorException("Service is not healthy.");
    }
  }
}
