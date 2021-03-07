import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import findPosts from '../scrappers/find-posts';

const findPhones = () => {};
const scorePhones = () => {};
const updatePosts = () => {};
const rankPhones = () => {};

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 0 * * * *')
  updateAll() {
    this.logger.log('Updating all our tables!');

    findPhones();
    scorePhones();
    updatePosts();
    findPosts();
    rankPhones();

    this.logger.log('All table are updated!');
  }
}
