import { Module } from '@nestjs/common';
import { HostService } from './host.service';
import { HostController } from './host.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Host } from './entities/host.entity';
import { Subscriber as EncryptedColumnSubscriber} from 'typeorm-encrypted-column';

@Module({
  imports: [TypeOrmModule.forFeature([Host])],
  controllers: [HostController],
  providers: [HostService, EncryptedColumnSubscriber],
  exports: [HostService]
})
export class HostModule {}
