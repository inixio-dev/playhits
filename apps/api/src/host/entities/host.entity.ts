import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {EncryptedColumn} from 'typeorm-encrypted-column';
import { Catalogue } from '../../catalogue/entities/catalogue.entity';
import { environment } from '../../environments/environment';
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

    @OneToMany(() => Catalogue, catalogue => catalogue.host)
    catalogues: Catalogue[];

}
