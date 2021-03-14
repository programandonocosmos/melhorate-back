import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from '../scrapper/phone.entity';

const findPhones = async () => {};
const scorePhones = async () => {};
const updatePosts = async () => {};
const findPosts = async () => {};
const rankPhones = async () => {};

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Phone)
    private phonesRepository: Repository<Phone>,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 * * * *')
  async updateAll() {
    this.logger.log('Updating all our tables!');

    await findPhones();
    await scorePhones();
    await updatePosts();
    await findPosts();
    await rankPhones();

    this.logger.log('All table are updated!');
  }
}
