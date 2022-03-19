import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { User } from './user.entity';
import { UserService } from './users.service';

@Module({
  imports: [FireormModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
