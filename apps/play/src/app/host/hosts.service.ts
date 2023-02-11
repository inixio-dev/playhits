import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HostsService {

  constructor(private http: HttpClient) { }

  getMyInfo() {
    return this.http.get(`${environment.apiUrl}/auth/me`).pipe(take(1));
  }

  getRequests(page = 0) {
    return this.http.get(`${environment.apiUrl}/request?page=${page}`).pipe(take(1));
  }

  addToCatalogue(playlist: any) {
    return this.http.post(`${environment.apiUrl}/catalogue`, playlist);
  }

  removeFromCatalogue(spotifyPlaylistId: string) {
    return this.http.delete(`${environment.apiUrl}/catalogue/${spotifyPlaylistId}`);
  }
}
