import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Host } from "../../host/entities/host.entity";
import { SongRequest } from "../../request/entities/request.entity";

@Entity()
export class Song {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    spotifyPlaylistId: string;

    @Column()
    spotifySongId: string;

    @Column()
    spotifySongUrl: string;

    @Column()
    title: string;

    @Column()
    artist: string;

    @ManyToOne(() => Host, (host) => host.songs)
    host: Host;

    @OneToMany(() => SongRequest, request => request.song)
    requests: SongRequest[];
}
