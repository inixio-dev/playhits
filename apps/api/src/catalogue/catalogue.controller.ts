/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Post, Body, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatalogueService } from './catalogue.service';

@Controller('catalogue')
@ApiTags('Catalogue')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCatalogueDto: any, @Req() req: any) {
    return this.catalogueService.create(createCatalogueDto, req);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') spotifyPlaylistId: string, @Req() req: any) {
    return this.catalogueService.remove(spotifyPlaylistId, req);
  }

}
