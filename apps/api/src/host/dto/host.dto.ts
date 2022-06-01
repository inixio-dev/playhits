import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Catalogue } from "../../catalogue/entities/catalogue.entity";

export class HostDto {
    
    @ApiProperty()
    @Optional()
    id?: string;

    @ApiProperty({
        description: 'Name of the host host',
        example: 'Example Host'
    })
    name: string;

    @ApiProperty({
        description: 'List of playlists available'
    })
    catalogues: Catalogue[];

    @ApiProperty({
        description: 'Logged in in spotify'
    })
    loggedInSpotify: boolean;

}