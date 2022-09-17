import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Host } from '../host/entities/host.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { HostDto } from '../host/dto/host.dto';
import { environment } from '../environments/environment';
import qs = require('qs');
import axios from 'axios';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Host) private hostRepository: Repository<Host>,
        private jwtService: JwtService) {}

    async login(loginInfo: LoginDto) {
        const host = await this.hostRepository.findOne({
            ...loginInfo
        });
        if (!host) {
            throw new UnauthorizedException();
        }
        const { id } = host;
        const access_token = this.jwtService.sign({id});
        return {access_token};
    }

    async getMyData(req): Promise<HostDto> {
        const { id } = req.user;
        const host = await this.hostRepository.findOne({id}, {relations: ['catalogues']});
        if (!host) {
            throw new UnauthorizedException();
        }
        const { name, catalogues } = host;
        return {id, name, catalogues, loggedInSpotify: host.spotifyToken !== null && host.spotifyRefreshToken !== null};
    }

    async saveSpotifyToken(code: string, hostId: string) {
        const {client_id, client_secret, redirect_uri} = environment;
        const res: any = await axios({
            method: 'post',
            headers: {
                Authorization:
                    "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
                    "content-type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({code, redirect_uri, grant_type: 'authorization_code'}),
            url: "https://accounts.spotify.com/api/token",
        }).catch(e => console.log(e));
        const {access_token, refresh_token} = res.data;
        if (access_token && refresh_token) {
            await this.hostRepository.update({id: hostId}, {
                spotifyToken: access_token,
                spotifyRefreshToken: refresh_token
            });
        }
        return await this.hostRepository.findOne({id: hostId});

    }

    async refreshSpotifyToken(refresh_token: string, hostId: string) {
        const {client_id, client_secret, redirect_uri} = environment;
        const res: any = await axios({
            method: 'post',
            headers: {
                Authorization:
                    "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
                    "content-type": "application/x-www-form-urlencoded",
            },
            data: qs.stringify({refresh_token, grant_type: 'refresh_token'}),
            url: "https://accounts.spotify.com/api/token",
        }).catch(e => console.log(e));
        const {access_token} = res.data;
        console.log('New access token', access_token);
        if (access_token) {
            await this.hostRepository.update({id: hostId}, {
                spotifyToken: access_token
            });
        }
        return await this.hostRepository.findOne({id: hostId});

    }
}
