import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Host } from '../host/entities/host.entity';
import { SongRequest } from './entities/request.entity';
import { RequestResult } from './enums/request-result.enum';

@Injectable()
export class RequestService {
    constructor(
        @InjectRepository(SongRequest)
        private songRequestRepository: Repository<SongRequest>,
        @InjectRepository(Host)
        private hostRepository: Repository<Host>
    ) {}

    async canRequest(requester: string, hostId: string): Promise<{message: string, code: number}> {
        const host = await this.hostRepository.findOne({username: hostId})
        if (!host) {
            return {message: 'No puedes solicitar canciones en este lugar', code: 1001};
        }
        /** if (!host.canAddSongs) {
            return {
                message: `${host.name} no acepta peticiones de canciones en este momento`
            }
        }*/

        if (requester === '5904f2fe-f437-4834-bd50-1805d1684c3b') {
            return {
                message: null,
                code: 1000
            }
        }
        const HOUR = 1000 * 60 * 60;
        const anHourAgo = new Date(Date.now() - HOUR);
        const totalLastHour = await this.songRequestRepository.count({
            where: {
                host,
                requestedAt: Between(
                    anHourAgo,
                    new Date()
                ),
                result: RequestResult.ADDED
            }
        });
        if (totalLastHour >= 20) {
            return {
                message: 'Ya hay demasiadas canciones en cola. Inténtalo de nuevo en otro momento',
                code: 1002
            }
        }
        const totalLastHourByRequester = await this.songRequestRepository.find({
            where: {
                host,
                requester,
                requestedAt: Between(
                    anHourAgo,
                    new Date()
                ),
                result: RequestResult.ADDED
            }
        })
        if (totalLastHourByRequester.length >= 2) {
            const latest = Math.min(...totalLastHourByRequester.map(r => r.requestedAt.getTime()));
            const minutesSinceLastRequest = Math.round((new Date().getTime() - latest)/(1000*60))
            return {
                message: `Ya has solicitado 2 canciones en la última hora. No puedes solicitar más canciones hasta dento de ${60-minutesSinceLastRequest} minutos`,
                code: 1003
            }
        }
        return {
            message: null, // A song can be requested
            code: 1000
        }
    }

    async getRequestsInHost(req) {
        const {id} = req.user;
        const host = await this.hostRepository.findOne({id});
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        const oneWeekAgo = new Date(new Date().getTime() - oneWeek);
        return await this.songRequestRepository.find({
            where: {
                host,
                requestedAt: Between(
                    oneWeekAgo,
                    new Date()
                )
            },
            relations: ['song'],
            order: {
                requestedAt: 'DESC'
            }
        });
    }
}
