import { Controller, Get, Query } from '@nestjs/common';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  findAll(@Query('hostId') hostId: string) {
    return this.songService.findAll(hostId);
  }

}
