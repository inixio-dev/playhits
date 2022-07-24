import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { MyPlaylistsDto } from '../dtos/MyPlaylists.dto';
import { HostDto } from './dto/host.dto';
import { HostsService } from './hosts.service';

@Component({
  selector: 'playhits-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent implements OnInit {

  host?: HostDto;
  myPlaylists?: MyPlaylistsDto;
  setOfCheckedId = new Set<any>();
  currentPage = 1;
  appUrl = environment.appUrl;

  constructor(private hostService: HostsService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.hostService.getMyInfo().subscribe({
      next: (res: any) => {
        this.host = res;
        console.log(this.host);
        this.host?.catalogues.forEach(c => this.setOfCheckedId.add(c.spotifyPlaylistId));
        this.route.queryParams.subscribe((qp) => {
          const {code, status, error} = qp;
          if (code) {
            this.authService.saveTokenFromCode(code).pipe(take(1)).subscribe({
              next: (res) => {
                window.location.reload();
              },
              error: () => {
                this.router.navigate(['host']);
              }
            });
          }
        });
        console.log('Estoy aqui')
        this.authService.getMyPlaylists(this.currentPage).subscribe({
          next: (res: any) => {
            this.myPlaylists = res;
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  authorizeSpotify() {
    this.authService.authorizeSpotify();
  }

  onItemChecked(id: string, selected: any) {
    let request;
    const playlist = this.myPlaylists?.items.find(p => p.id === id)
    if (selected) {
      request = this.hostService.addToCatalogue(playlist);
    } else {
      request = this.hostService.removeFromCatalogue(id);
    }
    request.pipe(take(1)).subscribe({
      next: (res) => {
        if (selected) {
          this.setOfCheckedId.add(id);
        } else {
          this.setOfCheckedId.delete(id);
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onAllChecked(event: any) {
    console.log('All checked', event)
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.authService.getMyPlaylists(this.currentPage).subscribe({
      next: (res: any) => {
        this.myPlaylists = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  loadDefaultCover(event: any) {
    event.target.src = 'assets/default-cover.png';
  }
}
