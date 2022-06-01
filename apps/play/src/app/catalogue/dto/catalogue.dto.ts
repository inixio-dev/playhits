export class CatalogueDto {
    id: string;
    spotifyPlaylistId: string;
    name: string;
    imageUrl: string;

    constructor() {
        this.id = '';
        this.spotifyPlaylistId = '';
        this.name = '';
        this.imageUrl = '';
    }
}
