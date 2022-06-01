import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Host } from '../host/entities/host.entity';

@Injectable()
export class SpotifyService {

    constructor(private authService: AuthService, @InjectRepository(Host) private hostsRpository: Repository<Host>, private http: HttpService) {}

    private async getSpotifyTokens(req: any) {
        const {id} = req.user;
        if (!id) {
            throw new UnauthorizedException();
        }
        const host = await this.hostsRpository.findOne({id});
        if (!host || !host.spotifyToken || !host.spotifyRefreshToken) {
            throw new UnauthorizedException();
        }
        return {spotfyToken: host.spotifyToken, spotifyRefreshToken: host.spotifyRefreshToken};
    }

    private async refreshToken(userId: string, refreshToken: string) {
        return await this.authService.refreshSpotifyToken(refreshToken, userId);
    }

    async getMyPlaylists(req: any, page: number = 0) {
        const spotifyTokens = await this.getSpotifyTokens(req);
        try {
            const response = await axios.get(`https://api.spotify.com/v1/me/playlists?offset=${10*page}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${spotifyTokens.spotfyToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch(err) {
            if (err.response.status === 401) {
                await this.refreshToken(req.user.id, spotifyTokens.spotifyRefreshToken);
                return await this.getMyPlaylists(req, page);
            } else {
                console.log(JSON.stringify(err.response))
                throw new Error();
            }
        };
    }

    async getSongsFromPlaylist(hostId: string, id: string) {
        const spotifyTokens = await this.getSpotifyTokens({user: {id: hostId}});
        try {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=50`, {
                headers: {
                    'Authorization': `Bearer ${spotifyTokens.spotfyToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch(err) {
            if (err.response.status === 401) {
                await this.refreshToken(hostId, spotifyTokens.spotifyRefreshToken);
                return await this.getSongsFromPlaylist(hostId, id);
            } else {
                throw new Error();
            }
        };
    }

    async addSongToQueue(id: string, songUrl: string) {
        const spotifyTokens = await this.getSpotifyTokens({user: {id}});
        console.log('Tokens', spotifyTokens);
        try {
            const response = await axios.post(`	https://api.spotify.com/v1/me/player/queue?uri=${songUrl}`, {}, {
                headers: {
                    'Authorization': `Bearer ${spotifyTokens.spotfyToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch(err) {
            console.log(err.response)
            if (err.response.status === 401) {
                await this.refreshToken(id, spotifyTokens.spotifyRefreshToken);
                return await this.addSongToQueue(id, songUrl);
            } else {
                throw new Error();
            }
        };
    }


}
