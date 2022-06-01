import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HostService } from './host.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('host')
@ApiTags('Hosts')
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Post()
  create(@Body() createHostDto: CreateHostDto) {
    return this.hostService.create(createHostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hostService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHostDto: UpdateHostDto) {
    return this.hostService.update(+id, updateHostDto);
  }

}
