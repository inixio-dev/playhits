import { HostDto } from "../../host/dto/host.dto";
import { Song } from "../../song/entities/song.entity";

export class SongRequestDto {
    id: string;
    host: HostDto;
    requester: string;
    requestedAt: Date;
    song: Song
}