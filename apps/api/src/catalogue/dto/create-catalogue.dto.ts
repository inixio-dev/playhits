import { ApiProperty } from "@nestjs/swagger";

export class CreateCatalogueDto {
    @ApiProperty({
        description: 'ID of the Spotify playlist',
        example: '09dPR4NbZRQ6QJy9ccCGL6'
    })
    spotifyPlaylistId: string;
}
