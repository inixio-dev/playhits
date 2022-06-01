import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Host } from "../../host/entities/host.entity";

@Entity()
export class Catalogue {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    spotifyPlaylistId: string;

    @Column()
    name: string;

    @Column()
    imageUrl: string;

    @ManyToOne(() => Host, host => host.catalogues)
    host: Host;

}
