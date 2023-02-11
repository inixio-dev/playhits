import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { stringify } from 'querystring';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('check')
  checkRequest(@Query('requester') requester: string, @Query('host') hostUsername: string) {
    return this.requestService.canRequest(requester, hostUsername);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMyPlaylists(@Req() req: any, @Query('page') page: number) {
      return this.requestService.getRequestsInHost(req, page);
  }
}
