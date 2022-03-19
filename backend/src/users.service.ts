import { Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: BaseFirestoreRepository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    return await this.users.findById(id);
  }

  async createOne(): Promise<User> {
    const user = new User();
    user.name = 'testName';
    return await this.users.create(user);
  }
}
