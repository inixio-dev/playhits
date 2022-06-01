import { CatalogueDto } from "../../catalogue/dto/catalogue.dto";

export class HostDto {
    
    id?: string;
    name: string;
    catalogues: CatalogueDto[];
    loggedInSpotify: boolean;

    constructor() {
        this.name = '';
        this.catalogues = [];
        this.loggedInSpotify = false;
    }

}