import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRequest } from './entities/request.entity';
import { Host } from '../host/entities/host.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongRequest, Host])
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService]
})
export class RequestModule {}
