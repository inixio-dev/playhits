import { Controller, Get, Param } from '@nestjs/common';
import { HostService } from './host.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('host')
@ApiTags('Hosts')
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hostService.findOne(id);
  }

}
