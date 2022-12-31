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

    private async getSpotifyTokens(req) {
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

    async getMyPlaylists(req, page = 0) {
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
            console.log(err);
            if (err.response.status === 401) {
                await this.refreshToken(req.user.id, spotifyTokens.spotifyRefreshToken);
                return await this.getMyPlaylists(req, page);
            } else {
                throw new Error();
            }
        };
    }

    async getSongsFromPlaylist(hostId: string, id: string, page = 0, songs = []) {
        const spotifyTokens = await this.getSpotifyTokens({user: {id: hostId}});
        try {
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&offset=${50*page}`, {
                headers: {
                    'Authorization': `Bearer ${spotifyTokens.spotfyToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            response.data.items = [...response.data.items, ...songs];
            if (response.data.next) {
                return await this.getSongsFromPlaylist(hostId, id, page + 1, response.data.items);
            } else {
                return response.data;
            }
        } catch(err) {
            if (err.response?.status === 401) {
                await this.refreshToken(hostId, spotifyTokens.spotifyRefreshToken);
                return await this.getSongsFromPlaylist(hostId, id, page, songs);
            } else {
                throw new Error();
            }
        };
    }

    async addSongToQueue(id: string, songUrl: string) {
        const alreadyInQueue = await this.checkIfAlreadyInQueue(id, songUrl);
        if (alreadyInQueue) {
            return {
                message: 'Esta canción ya está en la cola, sonará en breve'
            }
        }
        const recentlyPlayed = await this.checkIfRecentlyPlayed(id, songUrl);
        if (recentlyPlayed) {
            const timeAgo = parseInt(`${(new Date().getTime() - new Date(recentlyPlayed.played_at).getTime()) / 60000}`);
            console.log(timeAgo);
            return {
                message: `${timeAgo > 3 ? `Esta canción ha sonado hace ${timeAgo} minutos.` : 'Esta canción acaba de sonar.'} Prueba a pedir otra canción o espera un rato y pídela de nuevo`
            }
        }
        const spotifyTokens = await this.getSpotifyTokens({user: {id}});
        try {
            await axios.post(`https://api.spotify.com/v1/me/player/queue?uri=${songUrl}`, {}, {
                headers: {
                    'Authorization': `Bearer ${spotifyTokens.spotfyToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return {
                message: '¡La canción se ha añadido a la cola! Sonará en breve'
            };
        } catch(err) {
            if (err.response.status === 401) {
                await this.refreshToken(id, spotifyTokens.spotifyRefreshToken);
                return await this.addSongToQueue(id, songUrl);
            } else {
                throw new Error();
            }
        };
    }

    async getQueue(id: string) {
        const spotifyTokens = await this.getSpotifyTokens({user: {id}});
        try {
            const response = await axios.get(`https://api.spotify.com/v1/me/player/queue`, {
                headers: {
                    'Authorization': `Bearer ${spotifyTokens.spotfyToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch(err) {
            if (err.response.status === 401) {
                await this.refreshToken(id, spotifyTokens.spotifyRefreshToken);
                return await this.getQueue(id);
            } else {
                throw new Error();
            }
        };
    }

    async getQueueLength(id: string) {
        const queue = await this.getQueue(id);
        return {
            queueLength: queue.queue.length
        }
    }

    async checkIfAlreadyInQueue(id: string, songUrl: string): Promise<boolean> {
        const queue = await this.getQueue(id);
        if (queue.currently_playing && queue.currently_playing.uri === songUrl) {
            return true;
        }
        return this.getIndexInQueue(queue, songUrl) >= 0;
    }

    private getIndexInQueue(queue, songUrl: string) {
        const inQueue = queue.queue.findIndex(t => {
            return t.uri === songUrl
        });
        return inQueue;
    }

    private async getWaitingMinutes(id: string, songUrl: string) {
        const queue = await this.getQueue(id);
        const index = this.getIndexInQueue(queue, songUrl);
        if (index === -1) {
            return null;
        }
        const miliseconds = queue.queue.slice(0, index).reduce((p,c) => c = p + c.duration_ms, 0);
        return parseInt(`${miliseconds/60/60}`);
    }


    async getRecentlyPlayed(id: string) {
        const spotifyTokens = await this.getSpotifyTokens({user: {id}});
        try {
            const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played`, {
                headers: {
                    'Authorization': `Bearer ${spotifyTokens.spotfyToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch(err) {
            if (err.response.status === 401) {
                await this.refreshToken(id, spotifyTokens.spotifyRefreshToken);
                return await this.getRecentlyPlayed(id);
            } else {
                throw new Error();
            }
        };
    }

    async checkIfRecentlyPlayed(id: string, songUrl: string) {
        const recentlyPlayed = await this.getRecentlyPlayed(id);
        const played = recentlyPlayed.items.find(i => {
            return i.track.uri === songUrl
        });
        return played;
    }

}
