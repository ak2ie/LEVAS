import { Controller, Get, Put } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<string> {
    const user = await this.userService.findOne('1');
    return user.id;
  }

  @Put()
  async createUsers(): Promise<string> {
    const user = await this.userService.createOne();
    return user.id;
  }
}
