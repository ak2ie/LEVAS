import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './firebase.strategy';
import { LINEAuthGuard } from './line.guard';

@Module({
  imports: [PassportModule],
  providers: [FirebaseStrategy, LINEAuthGuard],
})
export class AuthModule {}
