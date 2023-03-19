import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Host } from "../../host/entities/host.entity";
import { Song } from "../../song/entities/song.entity";
import { RequestResult } from "../enums/request-result.enum";

@Entity()
export class SongRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Host, (host) => host.requests)
    host: Host;

    @ManyToOne(() => Song, (song) => song.requests, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    song: Song;

    @Column()
    requester: string;

    @CreateDateColumn()
    requestedAt: Date;

    @Column({
        type: 'enum',
        enum: RequestResult,
        default: RequestResult.ADDED
    })
    result: RequestResult;
}