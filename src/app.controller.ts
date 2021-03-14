import { Controller, Get, Query, Logger } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/phones")
  getPhones(@Query() query) {
    this.logger.log(`Finding best phones with budget ${query.price}.`);
    return [
      {
        uid: "9f18d5a8-2baa-4628-93b2-88677e9a290f",
        price: 1000,
        name: "Xiaomi Mi A3",
        picture: "",
      },
      {
        uid: "8ec9def2-40bd-4654-9b2c-9d00e969bb26",
        price: 800,
        name: "Samsung M1",
        picture: "",
      },
    ];
  }
}
