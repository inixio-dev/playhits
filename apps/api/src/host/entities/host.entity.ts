import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {EncryptedColumn} from 'typeorm-encrypted-column';
import { Catalogue } from '../../catalogue/entities/catalogue.entity';
import { environment } from '../../environments/environment';
import { SongRequest } from '../../request/entities/request.entity';
import { Song } from '../../song/entities/song.entity';
@Entity()
export class Host {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    code: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @EncryptedColumn({
        encrypt: environment.encrypt
    })
    password: string;

    @Column({nullable: true})
    spotifyToken: string;

    @Column({nullable: true})
    spotifyRefreshToken: string;

    @Column()
    canAddSongs: boolean;

    @OneToMany(() => Catalogue, catalogue => catalogue.host)
    catalogues: Catalogue[];

    @OneToMany(() => Song, song => song.host)
    songs: Song[];

    @OneToMany(() => SongRequest, request => request.host)
    requests: SongRequest[];

}
