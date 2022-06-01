import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Host } from '../host/entities/host.entity';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Host]),
    HttpModule,
    AuthModule
  ],
  providers: [SpotifyService],
  controllers: [SpotifyController]
})
export class SpotifyModule {}
