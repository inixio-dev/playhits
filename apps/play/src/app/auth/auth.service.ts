import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';
import { JWTDto } from './dto/jwt.dto';
import { LoginDto } from './dto/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  JWT_KEY = `playhits_jwt${environment.production ? '' : '_dev'}`;

  constructor(private httpClient: HttpClient) { }

  login(loginData: LoginDto) {
    return this.httpClient.post(`${environment.apiUrl}/auth/login`, loginData).pipe(take(1));
  }

  storeJWT(jwt: JWTDto) {
    localStorage.setItem(this.JWT_KEY, jwt.access_token);
  }

  getJWT(): string | null {
    return localStorage.getItem(this.JWT_KEY);
  }

  authorizeSpotify() {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${environment.client_id}&response_type=code&redirect_uri=${environment.redirect_url}&scope=user-modify-playback-state playlist-read-collaborative playlist-read-private user-read-playback-state user-read-recently-played`;
  }

  saveTokenFromCode(code: string) {
    return this.httpClient.post(`${environment.apiUrl}/auth/spotify-token`, {code});
  }

  getMyPlaylists(page: number) {
    const jwt = this.getJWT();
    return this.httpClient.get(`${environment.apiUrl}/spotify/myplaylists?page=${page - 1}`).pipe(take(1));
  }
}
