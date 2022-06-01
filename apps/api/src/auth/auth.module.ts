import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Host } from '../host/entities/host.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwtConstants';
import { JwtStrategy } from './jwtStrategy';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([Host]),
    JwtModule.register({
      secret: jwtConstants.secret
    }),
    HttpModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
