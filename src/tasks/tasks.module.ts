import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Phone } from "../scrapper/phone.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Phone])],
  providers: [TasksService],
})
export class TasksModule {}
