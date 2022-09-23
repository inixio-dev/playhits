import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable()
export class CatalogueService {
    constructor(private http: HttpClient) {}

    getCatalogueFromHost(hostId: string) {
        return this.http.get(`${environment.apiUrl}/host/${hostId}`).pipe(take(1));
    }

    getSongsFromHost(hostId: string) {
        return this.http.get(`${environment.apiUrl}/song?hostId=${hostId}`).pipe(take(1));
    }

    getSongsFromPlaylist(hostId: string, playlistId: string) {
        return this.http.get(`${environment.apiUrl}/spotify/playlists/${hostId}/${playlistId}`).pipe(take(1));
    }

    addSongToQueue(hostId: string, songUrl: string) {
        return this.http.post(`${environment.apiUrl}/spotify/queue/${hostId}?url=${songUrl}`, {}).pipe(take(1));
    }
}