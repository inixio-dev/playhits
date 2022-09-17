import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {

    constructor(private spotifyService: SpotifyService) {}

    @Get('myplaylists')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getMyPlaylists(@Req() req: any, @Query('page') page: number) {
        return this.spotifyService.getMyPlaylists(req, page);
    }

    @Get('playlists/:host/:id')
    async getSongsFromPlaylist(@Param('host') hostId: string, @Param('id') id: string) {
        return this.spotifyService.getSongsFromPlaylist(hostId, id);
    }

    @Post('queue/:hostId')
    async addSongToQueue(@Param('hostId') hostId: string, @Query('url') songUrl: string) {
        return this.spotifyService.addSongToQueue(hostId, songUrl);
    }

    @Get('queue/:hostId')
    async getQueue(@Param('hostId') hostId: string) {
        return this.spotifyService.getQueue(hostId);
    }
}
