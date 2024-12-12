import { ConfigModule } from "@nestjs/config";
import configuration from "./configuration";

export const defaultImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration]
  })
];
